// @mui material components
import Grid from "@mui/material/Grid";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";

// Material Dashboard 2 React contexts
import { useMaterialUIController } from "context";

// Material Dashboard 2 React example components
import DashboardLayout from "custom/LayoutContainers/DashboardLayout";
import NavBar from "custom/Navbar";
// import DefaultLineChart from "custom/Charts/DefaultLineChart";
import AutoLineChart from "custom/Charts/AutoLineChart";
import StatisticsCard from "custom/Cards/StatisticsCard";

// Data
// import reportsLineChartData from "layouts/dashboard/data/reportsLineChartData";

// Dashboard components
function Dashboard() {
  // const { tasks } = reportsLineChartData;
  const [controller] = useMaterialUIController();
  const { darkMode, sensorData } = controller;
  const sensorNames = Object.keys(sensorData);

  const renderCharts = (i) => {
    const chartProps = {
      color: darkMode ? "dark" : "info",
      title: sensorNames.length > i ? sensorNames[i] : "Undefined",
      scale: 50,
    };
    const { color, title, scale } = chartProps;
    return <AutoLineChart color={color} title={title} scale={scale} />;
  };

  const renderCards = (i) => {
    const valid = sensorNames.length > i;
    const cardProps = {
      color: "dark",
      title: "Undefined",
      count: "Undefined",
      percentage: { color: "info", amount: 50 },
    };
    if (valid) {
      cardProps.title = sensorNames[i];
      const dataEntry = sensorData[sensorNames[i]];
      const lastData = dataEntry[1][dataEntry[1].length - 1];
      cardProps.count = lastData;
      cardProps.percentage.amount = lastData;
      if (lastData >= 50) cardProps.percentage.color = "success";
      else if (lastData <= 25) cardProps.percentage.color = "error";
      else cardProps.percentage.color = "warning";
    }
    const { color, title, count, percentage } = cardProps;
    return <StatisticsCard color={color} title={title} count={count} percentage={percentage} />;
  };

  return (
    <DashboardLayout>
      <NavBar />
      <MDBox>
        <MDBox>
          <Grid container spacing={0}>
            <Grid item xs={12} md={12} lg={12}>
              <MDBox> {renderCharts(0)} </MDBox>
            </Grid>
            <Grid item xs={12} md={12} lg={12}>
              <MDBox> {renderCharts(1)} </MDBox>
            </Grid>
            <Grid item xs={12} md={12} lg={12}>
              <MDBox> {renderCharts(2)} </MDBox>
            </Grid>
            <Grid item xs={12} md={12} lg={12}>
              <MDBox> {renderCharts(3)} </MDBox>
            </Grid>
            <Grid item xs={12} md={12} lg={12}>
              <MDBox mb={3}>
                <MDBox> {renderCharts(4)} </MDBox>
              </MDBox>
            </Grid>
          </Grid>
        </MDBox>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}> {renderCards(4)} </MDBox>
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}> {renderCards(5)} </MDBox>
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}> {renderCards(6)} </MDBox>
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}> {renderCards(7)} </MDBox>
          </Grid>
        </Grid>
      </MDBox>
    </DashboardLayout>
  );
}

export default Dashboard;
