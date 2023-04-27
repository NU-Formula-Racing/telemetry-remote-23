// prop-types is a library for typechecking of props
import PropTypes from "prop-types";

// @mui material components
import Card from "@mui/material/Card";
import Divider from "@mui/material/Divider";
// import Icon from "@mui/material/Icon";
// import CardMedia from "@mui/material/CardMedia";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
// import MDProgress from "components/MDProgress";
import { Grid } from "@mui/material";
import { CircularProgressbarWithChildren, buildStyles } from "react-circular-progressbar";
// import image from "assets/images/front-right-wheel.png";

const darkModeColors = [
  // 03a9f4,
  "rgba(179, 136, 255, 1)",
  "rgba(130, 177, 255, 1)",
  "rgba(3, 218, 198, 1)",
  "rgba(207, 102, 121, 1)",
];
// const lightModeColors = [
//   "rgba(156, 39, 176, 1)",
//   "rgba(233, 30, 99, 1)",
//   "rgba(0, 188, 212, 1)",
//   "rgba(33, 150, 243, 1)",
// ];

const parseName = (str) => {
  if (!str || str.indexOf("_") === -1) {
    return "undefined";
  }
  const firstUnderscore = str.indexOf("_");
  return str.slice(firstUnderscore + 1);
};

const parseLabel = (str) => {
  if (!str || str.indexOf("_") === -1) {
    return str;
  }
  const label = str.split("_")[0];
  if (label.length <= 4) return label;
  return label.substring(0, 3);
};

function NumbersCard({ sensorLabels, sensorGroupData, unit, max }) {
  // const sensors = [title, title, title, title];
  // const data = [11, 22, 33, 44];
  // variant="button"
  // color="text"
  // fontWeight="light"

  const dataAverage = sensorGroupData.reduce((a, b) => a + b, 0) / sensorGroupData.length;
  return (
    <Card style={{ marginLeft: "1px", height: "14.5rem" }}>
      <Grid container spacing={0}>
        {sensorLabels.map((sensor, index) => (
          <Grid item xs={3} key={sensor}>
            <MDBox display="flex" justifyContent="space-between" flexDirection="column" pt={1}>
              <MDTypography variant="button" fontWeight="light" color="text" textAlign="center">
                {parseLabel(sensor)}
              </MDTypography>
              <MDBox px={1} pt={0} mb={-2.5}>
                <CircularProgressbarWithChildren
                  value={(sensorGroupData[index] / max) * 100}
                  // text={`20 km/h`}
                  circleRatio={1}
                  strokeWidth={10}
                  styles={buildStyles({
                    rotation: 1 / 2,
                    strokeLinecap: "butt",
                    textColor: "red",
                    trailColor: "#455e87",
                    pathColor: darkModeColors[index],
                  })}
                >
                  <MDTypography
                    variant="caption"
                    fontWeight="light"
                    color="text"
                    textAlign="center"
                    pb={3.5}
                  >
                    {sensorGroupData[index]}
                  </MDTypography>
                </CircularProgressbarWithChildren>
              </MDBox>
            </MDBox>
          </Grid>
        ))}
      </Grid>
      <Divider />
      <Grid container spacing={0}>
        <Grid item xs={6} sp={5}>
          <MDBox px={1}>
            <CircularProgressbarWithChildren
              value={(dataAverage / max) * 100}
              // text={`20 km/h`}
              circleRatio={0.75}
              strokeWidth={20}
              styles={buildStyles({
                rotation: 1 / 2 + 1 / 8,
                // strokeLinecap: "butt",
                trailColor: "#455e87",
                pathColor: "#d649c3",
              })}
            />
          </MDBox>
        </Grid>
        <Grid item xs={6} sp={7} display="flex" justifyContent="center" flexDirection="column">
          <MDBox pb={5} ml={1}>
            <MDTypography variant="h6" fontWeight="light" alignContent="center" pb={1}>
              {parseName(sensorLabels[0])}
            </MDTypography>
            <MDTypography
              display="inline"
              variant="h2"
              fontWeight="regular"
              alignContent="center"
              mr={0.5}
            >
              {dataAverage}
            </MDTypography>
            <MDTypography display="inline" variant="button" alignContent="center">
              {unit}
            </MDTypography>
          </MDBox>
        </Grid>
      </Grid>
      {/* <MDBox pb={2} px={2}>
        <MDBox display="flex" alignItems="center" justifyContent="flex-end">
          <MDTypography variant="caption" color="text" fontWeight="medium">
            {percentage.amount}%
          </MDTypography>
          <MDBox ml={0.5} width="9em">
            <MDProgress variant="gradient" color={percentage.color} value={percentage.amount} />
          </MDBox>
        </MDBox>
      </MDBox> */}
    </Card>
  );
}

// Setting default values for the props of StatisticsCard
NumbersCard.defaultProps = {
  // color: "info",
};
// Typechecking props for the StatisticsCard
NumbersCard.propTypes = {
  // color: PropTypes.oneOf([
  //   "primary",
  //   "secondary",
  //   "info",
  //   "success",
  //   "warning",
  //   "error",
  //   "light",
  //   "dark",
  // ]),
  sensorLabels: PropTypes.arrayOf(PropTypes.string).isRequired, // must be length 1-4
  sensorGroupData: PropTypes.arrayOf(PropTypes.number).isRequired,
  unit: PropTypes.string.isRequired,
  max: PropTypes.number.isRequired,
};

export default NumbersCard;
