// TODO:
// 1. Hook up data to display (store data in state using context? pass in range as props?)
//     store data in global state, component use name and index to access data
//    a. hook up 8 sensors to graphs (overlap?)
//        i. display average on the title of the graph
//    b. hook up 4 sensors to stats
// 2. make sure the right props are passed (no static img/data)
// 3. make scroll box for graphs ?
// 4. make multiple dashboards
// 5. focus on funtionality, then style

import { useEffect, useState } from "react";

// react-router components
import { Routes, Route, Navigate, useLocation } from "react-router-dom";

// @mui material components
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

// Material Dashboard 2 React example components
import Sidenav from "custom/Sidenav";
import Configurator from "custom/Configurator";

// Material Dashboard 2 React themes
import theme from "assets/theme";

// Material Dashboard 2 React Dark Mode themes
import themeDark from "assets/theme-dark";

// Material Dashboard 2 React routes
import routes from "routes";

// Material Dashboard 2 React contexts
import { useMaterialUIController, setSensorData, setNewSensorData } from "context";

// Images
import brandWhite from "assets/images/F1-logo.png";
// import brandDark from "assets/images/F1-logo.png";

// Socket.io
import socketio from "socket.io-client";

// util for inspecting objects for debugging
import util from "util";

const socket = socketio.connect("http://localhost:3001");

export default function App() {
  const [controller, dispatch] = useMaterialUIController();
  const { layout, transparentSidenav, whiteSidenav, darkMode, sensorData } = controller;
  // const [onMouseEnter, setOnMouseEnter] = useState(false);
  const [onInitData, setOnInitData] = useState(false);
  const { pathname } = useLocation();

  const handleNewSensor = (res) => setSensorData(dispatch, res);

  // called right after the first render completes
  // fetch init sensor data from server
  useEffect(() => {
    console.log("Component mounted. Fetching sensor data...");
    socket.emit("getSensors", (res) => {
      console.log("getSensors socket response: ", res);
      handleNewSensor(res);
    });
  }, []);

  const debug = true;
  // called when sensorData state changes
  useEffect(() => {
    if (debug) {
      console.log(
        `sensorData state changed:\n ${util.inspect(sensorData, {
          showHidden: false,
          depth: null,
          colors: true,
        })}`
      );
    }
    // if sensorData is not empty, then begin loading data into memory
    if (Object.keys(sensorData).length > 0 && !onInitData) {
      setOnInitData(true);
    }
  }, [sensorData]);

  // begin receiving real time data once sensorData state initialized
  useEffect(() => {
    socket.on("sendSensorData", (newSensorData) => {
      if (onInitData) {
        Object.keys(newSensorData).forEach((sensorName) => {
          const dataObj = {
            name: sensorName,
            data: newSensorData[sensorName],
          };
          // all data is stored into global context
          // mapping from sensor name to list of dataObj
          setNewSensorData(dispatch, dataObj);
        });
      }
    });
  }, [onInitData]);

  // Setting page scroll to 0 when changing the route
  useEffect(() => {
    document.documentElement.scrollTop = 0;
    document.scrollingElement.scrollTop = 0;
  }, [pathname]);

  const getRoutes = (allRoutes) =>
    allRoutes.map((route) => {
      if (route.collapse) {
        return getRoutes(route.collapse);
      }

      if (route.route) {
        return <Route exact path={route.route} element={route.component} key={route.key} />;
      }

      return null;
    });

  return (
    <ThemeProvider theme={darkMode ? themeDark : theme}>
      <CssBaseline />
      {layout === "dashboard" && (
        <>
          <Sidenav
            color={darkMode ? "dark" : "info"}
            brand={(transparentSidenav && !darkMode) || whiteSidenav ? brandWhite : brandWhite}
            brandName="NUFSAE Telemetry"
            routes={routes}
          />
          <Configurator />
        </>
      )}
      {layout === "vr" && <Configurator />}
      <Routes>
        {getRoutes(routes)}
        <Route path="*" element={<Navigate to="/dashboard" />} />
      </Routes>
    </ThemeProvider>
  );
}
