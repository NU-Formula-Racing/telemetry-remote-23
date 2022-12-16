import { useMemo, useState, useEffect } from "react";

// porp-types is a library for typechecking of props
import PropTypes from "prop-types";

// react-chartjs-2 components
import { Line } from "react-chartjs-2";

// Material Dashboard 2 React contexts
import { useMaterialUIController } from "context";

// @mui material components
import Card from "@mui/material/Card";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

// LineChart configurations
import configs from "custom/Charts/AutoLineChart/configs";

function AutoLineChart({ color, title, scale }) {
  const [controller] = useMaterialUIController();
  const { sensorData } = controller;
  const sensorNames = Object.keys(sensorData);
  const [description, setDescription] = useState("undefined");

  const { data, options } = configs([], { label: title, data: [] });
  const [chartData, setChartData] = useState(data);

  useEffect(() => {
    // check if sensor data has been initialized and loaded from ws
    if (!chartData) {
      console.log("chartData is undefined");
      return;
    }
    if (sensorNames.length > 0 && title in sensorData) {
      // set the number description of the chart
      const dataEntry = sensorData[title];
      const lastIndex = dataEntry[1].length - 1;
      setDescription(dataEntry[1][lastIndex]);
      // compare incoming data with last known chart data
      const chartDataLength = chartData.datasets[0].data.length;
      const lastChartDataTime = chartData.labels[chartDataLength - 1];
      const lastChartDataValue = chartData.datasets[0].data[chartDataLength - 1];
      const lastDataTime = dataEntry[0][lastIndex];
      const lastDataValue = dataEntry[1][lastIndex];
      // prevent displaying dupliacte data (sensorData updated multiple times per websocket emit)
      if (lastChartDataTime === lastDataTime && lastChartDataValue === lastDataValue) {
        return;
      }
      // update chart data array
      if (chartDataLength > scale) {
        // pop first element and append last element to the end
        setChartData({
          labels: [...chartData.labels.slice(1), dataEntry[0][lastIndex]],
          datasets: [
            {
              ...chartData.datasets[0],
              label: title,
              data: [...chartData.datasets[0].data.slice(1), dataEntry[1][lastIndex]],
            },
          ],
        });
      } else {
        // append last element to the endS
        setChartData({
          labels: [...chartData.labels, dataEntry[0][lastIndex]],
          datasets: [
            {
              ...chartData.datasets[0],
              label: title,
              data: [...chartData.datasets[0].data, dataEntry[1][lastIndex]],
            },
          ],
        });
      }
    }
  }, [sensorData]);

  return (
    <Card sx={{ height: "100%" }}>
      <MDBox>
        <MDBox pb={5} px={1} flex-direction="row-reverse">
          <MDTypography display="inline" variant="h6" textTransform="capitalize">
            {title} :
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
              <Line data={chartData} options={options} />
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
  title: PropTypes.string.isRequired,
  scale: PropTypes.number,
};

export default AutoLineChart;
