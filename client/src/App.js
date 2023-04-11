// TODO:
// 5. add meta data for units max, error, etc
// 6. add snack bar support for errors, socket events, alerts for data
// 6.5 add tutorial on the settings and side nav
// 7. write batch file to launch both
// MINOR TODO:
// On scroll, bounces to index 0, but on second scroll we good

import { useEffect } from "react";

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
  Status,
  useSensorController,
  setSocket,
  initSensorData,
  appendSensorData,
  setDataReceived,
  setStatus,
  setSessionData,
  setSensorMetaData,
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
  const { socket, sensorData } = sensorController;
  // const [onMouseEnter, setOnMouseEnter] = useState(false);
  const { pathname } = useLocation();

  // handle socket responses
  const handleSetSocket = (res) => setSocket(sensorDispatch, res);
  const handleSetStatus = (res) => setStatus(sensorDispatch, res);
  const handleSetSessionData = (res) => setSessionData(sensorDispatch, res);
  const handleInitSensorData = (res) => initSensorData(sensorDispatch, res);
  const handleAppendSensorData = (res) => appendSensorData(sensorDispatch, res);
  const handleSetDataReceived = () => setDataReceived(sensorDispatch);
  const handleSetSensorMetaData = (res) => setSensorMetaData(sensorDispatch, res);

  /*
   * initialize socket connection
   * fetch initial sensor data or session data
   */
  useEffect(() => {
    const newManager = new Manager("http://localhost:3001", { autoConnect: false });
    const newSocket = newManager.socket("/");
    console.log("App: Component mounted.");
    // or just dynamically updated
    newSocket.emit("startup", (res) => {
      console.log("App: startup response: ", res);
      handleSetSessionData(res.sessionList);
      handleInitSensorData(res.initValues);
      handleSetStatus(Status.CONNECTED);
      handleSetSensorMetaData(res.sensorMetaData);
    });
    // prevents socket from long polling
    newManager.on("error", () => {
      newSocket.disconnect();
    });

    handleSetSocket(newSocket);
  }, []);

  /*
   * set status state to true when sensorData is not empty
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
      handleSetStatus(Status.CONNECTED);
    }
    // if sensorData is not empty, then begin loading data into memory
    // if (Object.keys(sensorData).length > 0 && !connected) {
    //   handleSetConnected(true);
    // }
  }, [sensorData]);

  /*
   * set up socket listeners
   */
  useEffect(() => {
    if (!socket) {
      return;
    }
    socket.on("connect", () => {
      console.log("app: connected to server");
      handleSetStatus(Status.CONNECTED);
      socket.emit("fetchSessionData", (res) => {
        console.log("App: fetchSessionData response: ", res);
        handleSetSessionData(res);
      });
    });
    // tracks connection status
    socket.on("disconnect", () => {
      console.log("App: Disconnected from server");
      handleSetStatus(Status.DISCONNECTED);
      handleSetSessionData([]);
    });
    socket.on("sendSensorData", (newSensorData) => {
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
    });
  }, [socket]);

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
        <Route path="*" element={<Navigate to="/sessions" />} />
      </Routes>
    </ThemeProvider>
  );
}
