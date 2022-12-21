// TODO:
// 1. scroll box + pan? + extract to helper root?
// 4. adjust style (thinner graphs, display axis on last?)
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
import {
  useMaterialUIController,
  initSensorData,
  appendSensorData,
  setDataReceived,
  setServerOnline,
} from "context";

// Images
import brandWhite from "assets/images/F1-logo.png";
// import brandDark from "assets/images/F1-logo.png";

// Socket.io
import { Manager } from "socket.io-client";

// util for inspecting objects for debugging
import util from "util";

const manager = new Manager("http://localhost:3001", { autoConnect: true });
const socket = manager.socket("/");

export default function App() {
  const [controller, dispatch] = useMaterialUIController();
  const { layout, transparentSidenav, whiteSidenav, darkMode, sensorData } = controller;
  // const [onMouseEnter, setOnMouseEnter] = useState(false);s
  const [onInitialize, setOnInitialize] = useState(false);
  const { pathname } = useLocation();

  // have state and display for if server is online
  // display on navbar. connecting to server. or have like connected
  // have like red and green indicator. get rid of toasts on app.

  // catch connection errors, can be used to print toasts

  manager.on("error", (e) => {
    console.log(e);
  });

  // handle socket responses
  const handleInitSensorData = (res) => initSensorData(dispatch, res);
  const handleAppendSensorData = (res) => appendSensorData(dispatch, res);
  const handleSetDataReceived = () => setDataReceived(dispatch);

  // called right after the first render completes
  // fetch init sensor data from server
  useEffect(() => {
    console.log("Component mounted. Fetching sensor data...");
    socket.emit("getSensors", (res) => {
      console.log("getSensors socket response: ", res);
      handleInitSensorData(res);
    });
  }, []);

  const debug = false;
  // called when sensorData state changes
  useEffect(() => {
    if (debug && Object.keys(sensorData).length > 0) {
      const k = Object.keys(sensorData)[0];
      const data = sensorData[k];
      console.log(
        `sensorData state changed:\n ${util.inspect(data, {
          showHidden: false,
          depth: null,
          colors: true,
        })}`
      );
    }
    // if sensorData is not empty, then begin loading data into memory
    if (Object.keys(sensorData).length > 0 && !onInitialize) {
      setOnInitialize(true);
      setServerOnline(dispatch, true);
    }
  }, [sensorData]);

  // begin receiving real time data once sensorData state initialized
  useEffect(() => {
    socket.on("sendSensorData", (newSensorData) => {
      if (onInitialize) {
        Object.keys(newSensorData).forEach((sensorName) => {
          const dataObj = {
            name: sensorName,
            data: newSensorData[sensorName],
          };
          // all data is stored into global context
          // mapping from sensor name to list of dataObj
          handleAppendSensorData(dataObj);
        });
        handleSetDataReceived();
      }
    });
  }, [onInitialize]);

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
