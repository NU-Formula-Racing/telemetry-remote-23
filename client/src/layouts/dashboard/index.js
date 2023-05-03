// @mui material components
import React from "react";
import Grid from "@mui/material/Grid";
import PropTypes from "prop-types";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";

// Material Dashboard 2 React contexts
import { useMaterialUIController } from "context/MaterialUIProvider";
import { useSensorController } from "context/SensorProvider";

// Material Dashboard 2 React example components
import DashboardLayout from "custom/LayoutContainers/DashboardLayout";
import NavBar from "custom/Navbar";
import AutoLineChart from "custom/Charts/AutoLineChart";
import NumbersCard from "custom/Cards/NumbersCard";

// Dashboard components
function Dashboard({ sensorGroups }) {
  const [muiController] = useMaterialUIController();
  const { darkMode } = muiController;
  const [sensorController] = useSensorController();
  const { sensorData, sensorMetaData } = sensorController;
  const sensorNames = Object.keys(sensorData);

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
    const sensorDataValid = sensorNames.length > sensorList[sensorList.length - 1];
    const sensorMetaDataValid = sensorMetaData && Object.keys(sensorMetaData).length > 0;
    const cardProps = {
      sensorLabels: sensorList.map((i) => `${i}`),
      sensorGroupData: sensorList,
      // TODO: create metadata state in context for each sensor
      unit: "unit",
      max: 100,
    };
    if (sensorDataValid && sensorMetaDataValid) {
      cardProps.sensorLabels = sensorList.map((i) => sensorNames[i]);
      cardProps.sensorGroupData = sensorList.map((i) => {
        // get the last element of the array
        const dataEntry = sensorData[sensorNames[i]];
        const lastData = dataEntry[1][dataEntry[1].length - 1];
        return lastData;
      });
      cardProps.unit = sensorMetaData[sensorNames[sensorList[0]]].unit;
      cardProps.max = sensorMetaData[sensorNames[sensorList[0]]].max;
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
            {sensorGroups.map((sensorGroup) => (
              <React.Fragment key={sensorGroup[0]}>
                <Grid item xs={6} md={8} lg={9} xxl={10}>
                  <MDBox> {renderCharts(sensorGroup)} </MDBox>
                </Grid>
                <Grid item xs={6} md={4} lg={3} xxl={2}>
                  <MDBox> {renderCards(sensorGroup)} </MDBox>
                </Grid>
              </React.Fragment>
            ))}
          </Grid>
        </MDBox>
      </MDBox>
    </DashboardLayout>
  );
}

Dashboard.propTypes = {
  sensorGroups: PropTypes.array.isRequired,
};

export default Dashboard;
