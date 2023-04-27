import { useMemo } from "react";

// porp-types is a library for typechecking of props
import PropTypes from "prop-types";

// react-chartjs-2 components
import { Line } from "react-chartjs-2";

// @mui material components
import Card from "@mui/material/Card";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

// LineChart configurations
import configs from "custom/Charts/DefaultLineChart/configs";

function DefaultLineChart({ color, title, description, chart }) {
  const { data, options } = configs(chart.labels || [], chart.datasets || {});

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
              <Line data={data} options={options} />
            </MDBox>
          ),
          [chart, color]
        )}
      </MDBox>
    </Card>
  );
}

// Setting default values for the props of LineChart
DefaultLineChart.defaultProps = {
  color: "dark",
  description: "No description provided",
};

// Typechecking props for the LineChart
DefaultLineChart.propTypes = {
  color: PropTypes.oneOf(["primary", "secondary", "info", "success", "warning", "error", "dark"]),
  title: PropTypes.string.isRequired,
  description: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  chart: PropTypes.objectOf(PropTypes.oneOfType([PropTypes.array, PropTypes.object])).isRequired,
};

export default DefaultLineChart;
