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
import { useMaterialUIController } from "context";

// Images
import brandWhite from "assets/images/F1-logo.png";
// import brandDark from "assets/images/F1-logo.png";

// Socket.io
import socketio from "socket.io-client";

// util for inspecting objects for debugging
import util from "util";

const socket = socketio.connect("http://localhost:3001");

export default function App() {
  const [controller] = useMaterialUIController();
  const { layout, transparentSidenav, whiteSidenav, darkMode } = controller;
  // const [onMouseEnter, setOnMouseEnter] = useState(false);
  const { pathname } = useLocation();

  // called right after the first render completes
  useEffect(async () => {
    await socket.emit("getSensors", (res) => {
      console.log("getSensors res ", res);
      // this.setState({ currentSensors: res });
      // socket.disconnect();
    });
  }, []);

  // initialized on first render, stays active until component unmounted
  useEffect(() => {
    socket.on("sendSensorData", (sensorData) => {
      console.log(
        `sensor data ${util.inspect(sensorData, { showHidden: false, depth: null, colors: true })}`
      );
    });
  }, []);

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
