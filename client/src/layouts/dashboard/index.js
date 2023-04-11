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
// import StatisticsCard from "custom/Cards/StatisticsCard";
import NumbersCard from "custom/Cards/NumbersCard";

// Dashboard components
function Dashboard() {
  // const { tasks } = reportsLineChartData;
  const [muiController] = useMaterialUIController();
  const { darkMode } = muiController;
  const [sensorController] = useSensorController();
  const { sensorData } = sensorController;
  const sensorNames = Object.keys(sensorData);
  const sensorGroup1 = [0, 1, 2, 3]; // Wheel Speed
  const sensorGroup2 = [4, 5, 6, 7]; // Wheel Temp
  const sensorGroup3 = [8, 9]; // brake pressure

  const renderCharts = (sensorList) => {
    const sensorGroupTitles = sensorList.map((i) =>
      sensorNames.length > i ? sensorNames[i] : "Undefined"
    );

    const chartProps = {
      color: darkMode ? "dark" : "secondary",
      titles: sensorGroupTitles,
      scale: 200, // number of points to render on chart when scrolling
    };
    const { color, titles, scale } = chartProps;
    return <AutoLineChart color={color} titles={titles} scale={scale} />;
  };

  const renderCards = (sensorList) => {
    // check if data from sockets have arrived yet
    const valid = sensorNames.length > sensorList[sensorList.length - 1];
    const cardProps = {
      sensorLabels: ["UU", "UU", "UU", "UU"],
      sensorGroupData: sensorList,
      // TODO: create metadata state in context for each sensor
      unit: "km/h",
      max: 100,
    };
    if (valid) {
      cardProps.sensorLabels = sensorList.map((i) => sensorNames[i]);

      cardProps.sensorGroupData = sensorList.map((i) => {
        // get the last element of the array
        const dataEntry = sensorData[sensorNames[i]];
        const lastData = dataEntry[1][dataEntry[1].length - 1];
        return lastData;
      });

      // const dataEntry = sensorData[sensorNames[i]];
      // const lastData = dataEntry[1][dataEntry[1].length - 1];
      // cardProps.count = lastData;
      // cardProps.percentage.amount = lastData;
      // if (lastData >= 50) cardProps.percentage.color = "success";
      // else if (lastData <= 25) cardProps.percentage.color = "error";
      // else cardProps.percentage.color = "warning";
    }
    const { sensorLabels, sensorGroupData, unit, max } = cardProps;
    return (
      <NumbersCard
        sensorLabels={sensorLabels}
        sensorGroupData={sensorGroupData}
        unit={unit}
        max={max}
      />
    );
  };

  return (
    <DashboardLayout>
      <NavBar />
      <MDBox>
        <MDBox>
          <Grid container spacing={1}>
            <Grid item xs={6} md={8} lg={9} xxl={10}>
              <MDBox> {renderCharts(sensorGroup1)} </MDBox>
            </Grid>
            <Grid item xs={6} md={4} lg={3} xxl={2}>
              <MDBox> {renderCards(sensorGroup1)} </MDBox>
            </Grid>
            <Grid item xs={6} md={8} lg={9} xxl={10}>
              <MDBox> {renderCharts(sensorGroup2)} </MDBox>
            </Grid>
            <Grid item xs={6} md={4} lg={3} xxl={2}>
              <MDBox> {renderCards(sensorGroup2)} </MDBox>
            </Grid>
            <Grid item xs={6} md={8} lg={9} xxl={10}>
              <MDBox> {renderCharts(sensorGroup3)} </MDBox>
            </Grid>
            <Grid item xs={6} md={4} lg={3} xxl={2}>
              <MDBox> {renderCards(sensorGroup3)} </MDBox>
            </Grid>
          </Grid>
        </MDBox>
        {/* <Grid container spacing={3}>
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
        </Grid> */}
      </MDBox>
    </DashboardLayout>
  );
}

export default Dashboard;
