// TODO:
// 1. connect with session
// 2. package as electron app

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
import { useMaterialUIController } from "context/MaterialUIProvider";

import {
  useSensorController,
  initSensorData,
  appendSensorData,
  setDataReceived,
  setConnected,
} from "context/SensorProvider";

// Images
import brandWhite from "assets/images/F1-logo.png";
// import brandDark from "assets/images/F1-logo.png";

// Socket.io
import { Manager } from "socket.io-client";

// util for inspecting objects for debugging
import util from "util";

export default function App() {
  const [muiController] = useMaterialUIController();
  const { layout, transparentSidenav, whiteSidenav, darkMode } = muiController;
  const [sensorController, sensorDispatch] = useSensorController();
  const { sensorData, connected } = sensorController;
  // const [onMouseEnter, setOnMouseEnter] = useState(false);
  const [socket, setSocket] = useState(null);
  // const [manager, setManager] = useState(null);
  const { pathname } = useLocation();

  // have state and display for if server is online
  // display on navbar. connecting to server. or have like connected
  // have like red and green indicator. get rid of toasts on app.

  // handle socket responses
  const handleSetConnected = (res) => setConnected(sensorDispatch, res);
  const handleInitSensorData = (res) => initSensorData(sensorDispatch, res);
  const handleAppendSensorData = (res) => appendSensorData(sensorDispatch, res);
  const handleSetDataReceived = () => setDataReceived(sensorDispatch);

  /*
   * initialize socket connection
   * fetch initial sensor data or session data
   */
  useEffect(() => {
    const newManager = new Manager("http://localhost:3001", { autoConnect: false });
    const newSocket = newManager.socket("/");
    console.log("Component mounted. Fetching sensor data...");

    newSocket.emit("initializeSession", "session_id", (res) => {
      console.log("initializeSession response: ", res);
    });

    newSocket.emit("getSensors", (res) => {
      console.log("getSensors socket response: ", res);
      handleInitSensorData(res);
    });
    setSocket(newSocket);
    // setManager(newManager);
  }, []);

  /*
   * set connected state to true when sensorData is not empty
   */
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
    if (Object.keys(sensorData).length > 0 && !connected) {
      handleSetConnected(true);
    }
  }, [sensorData]);

  /*
   * set up socket listeners
   */
  useEffect(() => {
    if (!socket) {
      return;
    }
    // tracks connection status
    socket.on("disconnect", () => {
      console.log("Disconnected from server");
      handleSetConnected(false);
    });
    socket.on("sendSensorData", (newSensorData) => {
      if (connected) {
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
  }, [connected]);

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
            socket={socket}
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
