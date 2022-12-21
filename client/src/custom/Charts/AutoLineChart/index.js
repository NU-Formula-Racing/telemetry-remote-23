import { useMemo, useState, useEffect, useRef } from "react";

// porp-types is a library for typechecking of props
import PropTypes from "prop-types";

// react-chartjs-2 components
import { Line } from "react-chartjs-2";
import { Chart as ChartJS } from "chart.js";
import zoomPlugin from "chartjs-plugin-zoom";

// Material Dashboard 2 React contexts
import { useMaterialUIController } from "context";

// @mui material components
import Card from "@mui/material/Card";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDSnackbar from "components/MDSnackbar";

// LineChart configurations
import configs from "custom/Charts/AutoLineChart/configs";

// util for inspecting objects for debugging
import util from "util";

// for keydown event listener
import useEventListener from "@use-it/event-listener";

ChartJS.register(zoomPlugin);

const parseName = (str) => {
  if (!str || str.indexOf("_") === -1) {
    return "undefined";
  }
  const firstUnderscore = str.indexOf("_");
  return str.slice(firstUnderscore + 1);
};

function AutoLineChart({ color, titles, scale }) {
  const [controller] = useMaterialUIController();
  const { sensorData, dataReceived } = controller;
  const sensorNames = Object.keys(sensorData);
  const [description, setDescription] = useState("undefined");
  // titles guaranteed to be non-empty
  const chartName = parseName(titles[0]);
  const { data, options } = configs(titles);
  // stores data object for individual charts
  const [chartData] = useState(data);
  const [isZoomPan, setZoomPan] = useState(false);
  const [range, setRange] = useState({ start: 0, end: 0 });
  const chartRef = useRef();
  // takes cares of toast
  const [warningSB, setWarningSB] = useState(false);
  const [toastMsg, setToastMsg] = useState({ title: "error message", content: "error message" });
  const openWarningSB = () => setWarningSB(true);
  const closeWarningSB = () => setWarningSB(false);

  const renderWarningSB = (
    <MDSnackbar
      color="warning"
      icon="warning"
      title={toastMsg.title}
      content={toastMsg.content}
      dateTime="now"
      open={warningSB}
      onClose={closeWarningSB}
      close={closeWarningSB}
      bgWhite
    />
  );

  function renderSB(title, content) {
    setToastMsg({ title, content });
    openWarningSB();
  }

  // listen to key presses (auto mount/unmount)
  function handler({ key }) {
    if (!chartData) {
      console.log("chartData is undefined");
      renderSB("cannot zoom/pan", "chart data is undefined");
      return;
    }
    if (sensorNames.length <= 0) {
      console.log("websocket offline. no sensor detected");
      renderSB("cannot zoom/pan", "websocket offline. no sensor detected");
      return;
    }
    const { current: chart } = chartRef;
    if (!chart) {
      console.log(`chart is undefined for ${chartName}`);
      renderSB("cannot zoom/pan", `chart is undefined for ${chartName}`);
      return;
    }
    // don't allow pan/zoom if has less data than minrange
    const MIN_RANGE = 10;
    if (sensorData[titles[0]][0].length < MIN_RANGE) {
      console.log("not enough data to pan/zoom");
      renderSB("cannot zoom/pan", "not enough data to pan/zoom");
      return;
    }
    // a,d to pan
    // w,s to zoom
    // q,e to select range
    // capital letters to zoom quicker
    // currently zoom and pans all charts, need prop or context to differentiate
    // extract this into util file?

    const setDataToRange = (reset = false) => {
      let { start, end } = range;
      if (reset) {
        const lastIndex = sensorData[titles[0]][0].length;
        start = lastIndex - scale;
        end = lastIndex;
        setRange({ start, end });
      }
      const labels = sensorData[titles[0]][0].slice(start, end);
      const datasets = chart.data.datasets.map((dataset, index) => {
        const newData = sensorData[titles[index]][1].slice(start, end);
        return { ...dataset, data: newData };
      });
      chart.data = { labels, datasets };
      chart.update();
    };

    const moveRange = (amount) => {
      const { start, end } = range;
      let { leftAmount, rightAmount } = amount;
      if (start + leftAmount < 0) {
        leftAmount = -start;
      }
      if (end + rightAmount > sensorData[titles[0]][0].length) {
        rightAmount = sensorData[titles[0]][0].length - end;
      }
      if (end + rightAmount - start - leftAmount < MIN_RANGE) {
        // if have time can implement precise zoom to min range
        return;
      }
      setRange({ start: start + leftAmount, end: end + rightAmount });
    };

    function handleZoomPan(leftAmount, rightAmount) {
      setZoomPan(true);
      moveRange({ leftAmount, rightAmount });
      setDataToRange();
    }

    const small = 2;
    const large = 5;
    switch (key) {
      // zoom in
      case "w":
        handleZoomPan(small, -small);
        break;
      // zoom out
      case "s":
        handleZoomPan(-small, small);
        break;
      // pan left
      case "a":
        handleZoomPan(-small, -small);
        break;
      // pan right
      case "d":
        handleZoomPan(small, small);
        break;
      case "W":
        handleZoomPan(large, -large);
        break;
      case "S":
        handleZoomPan(-large, large);
        break;
      case "A":
        handleZoomPan(-large, -large);
        break;
      case "D":
        handleZoomPan(large, large);
        break;
      // reset zoom and pan
      case "R":
        setDataToRange(true);
        setZoomPan(false);
        break;
      default:
        break;
    }
  }
  useEventListener("keydown", handler);

  // useEffect(() => {
  //   const { start, end } = range;
  //   console.log(`range: ${start} - ${end}`);
  // }, [range]);

  function onZoomPan({ chart }) {
    console.log(chart);
    setZoomPan(true);
  }

  // runs everytime websocket event is received
  useEffect(() => {
    // check if sensor data has been initialized and loaded from ws
    if (!chartData) {
      console.log("chartData is undefined");
      // renderSB(`"${chartName}" chart error`, "chart data is undefined");
      return;
    }
    if (sensorNames.length < 0) {
      console.log("websocket offline. no sensor detected");
      // renderSB(`"${chartName}" chart error`, "websocket offline. no sensor detected");
      return;
    }
    const { current: chart } = chartRef;
    if (!chart) {
      console.log(`chart is undefined for ${chartName}`);
      // renderSB(`"${chartName}" chart error`, `chart is undefined for ${chartName}`);
      return;
    }

    if (isZoomPan) {
      // console.log("zoom/pan is active. stop receiving data");
      return;
    }

    chart.options.plugins.zoom.zoom.onZoom = onZoomPan;
    chart.options.plugins.zoom.pan.onPan = onZoomPan;

    let sumOfValue = 0;
    for (let i = 0; i < titles.length; i += 1) {
      if (titles[i] in sensorData) {
        // store values for description of the chart (average value)
        const dataEntry = sensorData[titles[i]];
        const lastIndex = dataEntry[1].length - 1;
        sumOfValue += dataEntry[1][lastIndex];
        // compare incoming data with last known chart data
        const chartDataLength = chart.data.datasets[i].data.length;
        const lastChartDataTime = chart.data.labels[chartDataLength - 1];
        const lastChartDataValue = chart.data.datasets[i].data[chartDataLength - 1];
        const lastDataTime = dataEntry[0][lastIndex];
        const lastDataValue = dataEntry[1][lastIndex];
        // prevent displaying dupliacte data (sensorData updated multiple times per websocket emit)
        if (lastChartDataTime === lastDataTime && lastChartDataValue === lastDataValue) {
          return;
        }
        // append new data to chart
        chart.data.datasets[i].label = titles[i];
        chart.data.datasets[i].data = [...chart.data.datasets[i].data, lastDataValue];
        // labels are shared across all datasets
        if (chart.data.labels.length < chart.data.datasets[i].data.length) {
          chart.data.labels.push(lastDataTime);
        }

        const { start, end } = range;
        if (chartDataLength > scale) {
          chart.data.datasets[i].data.shift();
          // shift scales if can fix mouse pan zoom
          // chart.options.scales.x.min = chart.data.labels[chartDataLength - scale];
          if (i === titles.length - 1) {
            chart.data.labels.shift();
            setRange({ start: start + 1, end: end + 1 });
          }
        } else if (i === titles.length - 1) {
          setRange({ start, end: end + 1 });
        }
      }
    }
    const debug = false;
    if (debug) {
      console.log(
        `chart state changed:\n ${util.inspect(chart.data.datasets, {
          showHidden: false,
          depth: null,
          colors: true,
        })}`
      );
    }
    setDescription(sumOfValue / titles.length);
    chart.update();
  }, [dataReceived]);

  return (
    <Card sx={{ height: "100%" }}>
      <MDBox>
        <MDBox pb={5} px={1} flex-direction="row-reverse">
          <MDTypography display="inline" variant="h6" textTransform="capitalize">
            {chartName} :
          </MDTypography>
          <MDTypography
            pl={1}
            component="div"
            variant="button"
            color="text"
            fontWeight="light"
            display="inline"
          >
            {description}
          </MDTypography>
        </MDBox>
        {useMemo(
          () => (
            <MDBox
              variant="contained"
              bgColor={color}
              borderRadius="lg"
              coloredShadow={color}
              py={2}
              pr={0.5}
              mt={-5}
              height="12.5rem"
            >
              <Line ref={chartRef} data={chartData} options={options} />
            </MDBox>
          ),
          [chartData, color]
        )}
      </MDBox>
      {renderWarningSB}
    </Card>
  );
}

// Setting default values for the props of LineChart
AutoLineChart.defaultProps = {
  color: "dark",
  scale: 100,
};

// Typechecking props for the LineChart
AutoLineChart.propTypes = {
  color: PropTypes.oneOf(["primary", "secondary", "info", "success", "warning", "error", "dark"]),
  titles: PropTypes.arrayOf(PropTypes.string).isRequired,
  scale: PropTypes.number,
};

export default AutoLineChart;
