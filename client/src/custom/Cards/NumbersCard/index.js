// prop-types is a library for typechecking of props
import PropTypes from "prop-types";

// @mui material components
import Card from "@mui/material/Card";
import Divider from "@mui/material/Divider";
// import Icon from "@mui/material/Icon";
import CardMedia from "@mui/material/CardMedia";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDProgress from "components/MDProgress";
import image from "assets/images/front-right-wheel.png";

function StatisticsCard({ color, title, count, percentage }) {
  return (
    <Card>
      <MDBox display="flex" justifyContent="space-between" pt={1} pr={2}>
        <MDBox
          variant="contained"
          bgColor="gray.600"
          color={color === "light" ? "dark" : "white"}
          borderRadius="xl"
          display="flex"
          justifyContent="center"
          alignItems="center"
          width="10rem"
          height="3rem"
          mt={1}
        >
          {/* <Icon fontSize="medium" color="inherit">
            {icon}
          </Icon> */}
          <CardMedia
            image={image}
            component="img"
            title="hello"
            sx={{
              maxWidth: "99%",
              margin: 0,
              objectFit: "cover",
              // boxShadow: "0px 0px 10px 10px rgba(225,225,225,1) inset",
              // objectPosition: "center",
            }}
          />
        </MDBox>
        <MDBox textAlign="right" lineHeight={1.25}>
          <MDTypography variant="button" fontWeight="light" color="text">
            {title}
          </MDTypography>
          <MDTypography variant="h4">{count}</MDTypography>
        </MDBox>
      </MDBox>
      <Divider />
      <MDBox pb={2} px={2}>
        <MDBox display="flex" alignItems="center" justifyContent="flex-end">
          <MDTypography variant="caption" color="text" fontWeight="medium">
            {percentage.amount}%
          </MDTypography>
          <MDBox ml={0.5} width="9em">
            <MDProgress variant="gradient" color={percentage.color} value={percentage.amount} />
          </MDBox>
        </MDBox>
      </MDBox>
    </Card>
  );
}

// Setting default values for the props of StatisticsCard
StatisticsCard.defaultProps = {
  color: "info",
  percentage: {
    color: "success",
    amount: 0,
    text: "",
    label: "",
  },
};

// Typechecking props for the StatisticsCard
StatisticsCard.propTypes = {
  color: PropTypes.oneOf([
    "primary",
    "secondary",
    "info",
    "success",
    "warning",
    "error",
    "light",
    "dark",
  ]),
  title: PropTypes.string.isRequired,
  count: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  percentage: PropTypes.shape({
    color: PropTypes.oneOf([
      "primary",
      "secondary",
      "info",
      "success",
      "warning",
      "error",
      "dark",
      "white",
    ]),
    amount: PropTypes.number,
    label: PropTypes.string,
  }),
  // icon: PropTypes.node.isRequired,
};

export default StatisticsCard;
