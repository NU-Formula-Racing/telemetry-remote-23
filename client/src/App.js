// TODO:
// 1. Hook up data to display (store data in state using context? pass in range as props?)
//     a. stop the graph from bouncing up
//     b. need to round the seconds down (how to limit the number of labels displayed while maintining resolution)
//     ba. add vertical line to show where the mouse is currently at inside of the
//     c. adjust scale and width
//     d. add the scroll bar on the bottom
//     e. render multiple/all gaphs
//     f. multiple dashboards?
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
import MDSnackbar from "components/MDSnackbar";

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
import { useMaterialUIController, initSensorData, appendSensorData } from "context";

// Images
import brandWhite from "assets/images/F1-logo.png";
// import brandDark from "assets/images/F1-logo.png";

// Socket.io
import { Manager } from "socket.io-client";

// util for inspecting objects for debugging
import util from "util";

const manager = new Manager("http://localhost:3001");
const socket = manager.socket("/");

export default function App() {
  const [controller, dispatch] = useMaterialUIController();
  const { layout, transparentSidenav, whiteSidenav, darkMode, sensorData } = controller;
  // const [onMouseEnter, setOnMouseEnter] = useState(false);
  const [onInitData, setOnInitData] = useState(false);
  const { pathname } = useLocation();
  // keep track of toast messages
  const [errorSB, setErrorSB] = useState(false);
  const [toastMsg, setToastMsg] = useState("error message");
  const openErrorSB = () => setErrorSB(true);
  const closeErrorSB = () => setErrorSB(false);

  // catch connection errors, can be used to print toasts
  manager.on("error", (e) => {
    openErrorSB();
    setToastMsg(e.message);
    console.log(e);
  });

  const renderErrorSB = (
    <MDSnackbar
      color="error"
      icon="warning"
      title={toastMsg}
      content="socket.io error. server may not be started."
      dateTime="now"
      open={errorSB}
      onClose={closeErrorSB}
      close={closeErrorSB}
      bgWhite
    />
  );

  // handle socket responses
  const handleInitSensorData = (res) => initSensorData(dispatch, res);
  const handleAppendSensorData = (res) => appendSensorData(dispatch, res);

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
          handleAppendSensorData(dataObj);
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
      {renderErrorSB}
    </ThemeProvider>
  );
}
