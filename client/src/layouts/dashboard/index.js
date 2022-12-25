// @mui material components
import Grid from "@mui/material/Grid";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";

// Material Dashboard 2 React contexts
import { useMaterialUIController } from "context/MaterialUIProvider";
import { useSensorController } from "context/SensorProvider";

// Material Dashboard 2 React example components
import DashboardLayout from "custom/LayoutContainers/DashboardLayout";
import NavBar from "custom/Navbar";
// import DefaultLineChart from "custom/Charts/DefaultLineChart";
import AutoLineChart from "custom/Charts/AutoLineChart";
import StatisticsCard from "custom/Cards/StatisticsCard";

// Dashboard components
function Dashboard() {
  // const { tasks } = reportsLineChartData;
  const [muiController] = useMaterialUIController();
  const { darkMode } = muiController;
  const [sensorController] = useSensorController();
  const { sensorData } = sensorController;
  const sensorNames = Object.keys(sensorData);
  const sensorGroup1 = [0, 1, 2, 3];
  const sensorGroup2 = [8, 9];

  const renderCharts = (sensorList) => {
    const sensorGroupTitles = sensorList.map((i) =>
      sensorNames.length > i ? sensorNames[i] : "Undefined"
    );

    const chartProps = {
      color: darkMode ? "dark" : "secondary",
      titles: sensorGroupTitles,
      scale: 50,
    };
    const { color, titles, scale } = chartProps;
    return <AutoLineChart color={color} titles={titles} scale={scale} />;
  };

  const renderCards = (i) => {
    // check if data from sockets have arrived yet
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
              <MDBox> {renderCharts(sensorGroup1)} </MDBox>
            </Grid>
            <Grid item xs={12} md={12} lg={12}>
              <MDBox mb={3}>
                <MDBox> {renderCharts(sensorGroup2)} </MDBox>
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
