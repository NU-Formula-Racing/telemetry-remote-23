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

// LineChart configurations
import configs from "custom/Charts/AutoLineChart/configs";

// util for inspecting objects for debugging
import util from "util";

ChartJS.register(zoomPlugin);

const parseName = (str) => {
  if (!str || str.indexOf("_") === -1) {
    return "undefined";
  }
  const firstUnderscore = str.indexOf("_");
  return str.slice(firstUnderscore + 1);
};

// use state to keep track if panning or zooming, stop the use effect
// make function to pass into the config
// dynamically pass in the data
// need access to state, need to be in side of the component

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
  const chartRef = useRef();

  // runs everytime websocket event is received
  useEffect(() => {
    // check if sensor data has been initialized and loaded from ws
    if (!chartData) {
      console.log("chartData is undefined");
      return;
    }

    if (sensorNames.length > 0) {
      const { current: chart } = chartRef;
      if (!chart) {
        console.log(`chart is undefined for ${chartName}`);
        return;
      }

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
          // FIXME: HERE
          // unrenders itself if data is too old, need to dynamically fetch data and rerender
          // no problem when all data is rendered

          if (chartDataLength > scale) {
            // chart.data.labels.shift();
            // chart.data.datasets[i].data.shift();
            chart.options.scales.x.min = chart.data.labels[chartDataLength - scale];
            // setRange({ start: chart.data.labels[chartDataLength - scale], end: range.end });
            // if (chartDataLength < scale) {
            //   console.log("k");
            // }
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
    }
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
