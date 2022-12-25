import { createContext, useContext, useReducer, useMemo } from "react";

// prop-types is a library for typechecking of props
import PropTypes from "prop-types";

// Material Dashboard 2 React main context
const MaterialUI = createContext();

// Setting custom name for the context which is visible on react dev tools
MaterialUI.displayName = "MaterialUIContext";

// Material Dashboard 2 React reducer
function reducer(state, action) {
  switch (action.type) {
    case "MINI_SIDENAV": {
      return { ...state, miniSidenav: action.value };
    }
    case "TRANSPARENT_SIDENAV": {
      return { ...state, transparentSidenav: action.value };
    }
    case "WHITE_SIDENAV": {
      return { ...state, whiteSidenav: action.value };
    }
    case "SIDENAV_COLOR": {
      return { ...state, sidenavColor: action.value };
    }
    case "TRANSPARENT_NAVBAR": {
      return { ...state, transparentNavbar: action.value };
    }
    case "FIXED_NAVBAR": {
      return { ...state, fixedNavbar: action.value };
    }
    case "OPEN_CONFIGURATOR": {
      return { ...state, openConfigurator: action.value };
    }
    case "DIRECTION": {
      return { ...state, direction: action.value };
    }
    case "LAYOUT": {
      return { ...state, layout: action.value };
    }
    case "DARKMODE": {
      return { ...state, darkMode: action.value };
    }
    // tracks connection to node js server
    case "CONNECTED": {
      return { ...state, connected: action.value };
    }
    case "INIT_SENSOR_DATA": {
      // should populate as a dict mapping from names to lists of data
      // console.log("SENSOR_DATA", action.value);
      return { ...state, sensorData: action.value };
    }
    case "APPEND_SENSOR_DATA": {
      // adds a single data point for a single sensor
      const { name, data } = action.value;
      return {
        ...state,
        sensorData: {
          ...state.sensorData,
          [name]: [
            // FIXME: cant just floor everything here
            [...state.sensorData[name][0], Math.floor(data.time * 10) / 10],
            [...state.sensorData[name][1], data.val],
          ],
        },
      };
    }
    case "ALL_DATA_RECEIVED": {
      return { ...state, dataReceived: !state.dataReceived };
    }
    default: {
      throw new Error(`Unhandled action type: ${action.type}`);
    }
  }
}

// Material Dashboard 2 React context provider
function MaterialUIControllerProvider({ children }) {
  const initialState = {
    miniSidenav: false,
    transparentSidenav: true,
    whiteSidenav: false,
    sidenavColor: "dark",
    transparentNavbar: true,
    fixedNavbar: true,
    openConfigurator: false,
    layout: "dashboard",
    darkMode: true,
    sensorData: {},
    dataReceived: false,
    connected: false,
  };

  const [muiController, muiDispatch] = useReducer(reducer, initialState);

  const value = useMemo(() => [muiController, muiDispatch], [muiController, muiDispatch]);

  return <MaterialUI.Provider value={value}>{children}</MaterialUI.Provider>;
}

// Material Dashboard 2 React custom hook for using context
function useMaterialUIController() {
  const context = useContext(MaterialUI);

  if (!context) {
    throw new Error(
      "useMaterialUIController should be used inside the MaterialUIControllerProvider."
    );
  }

  return context;
}

// Typechecking props for the MaterialUIControllerProvider
MaterialUIControllerProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

// Context module functions
const setMiniSidenav = (dispatch, value) => dispatch({ type: "MINI_SIDENAV", value });
const setTransparentSidenav = (dispatch, value) => dispatch({ type: "TRANSPARENT_SIDENAV", value });
const setWhiteSidenav = (dispatch, value) => dispatch({ type: "WHITE_SIDENAV", value });
const setSidenavColor = (dispatch, value) => dispatch({ type: "SIDENAV_COLOR", value });
const setTransparentNavbar = (dispatch, value) => dispatch({ type: "TRANSPARENT_NAVBAR", value });
const setFixedNavbar = (dispatch, value) => dispatch({ type: "FIXED_NAVBAR", value });
const setOpenConfigurator = (dispatch, value) => dispatch({ type: "OPEN_CONFIGURATOR", value });
const setDirection = (dispatch, value) => dispatch({ type: "DIRECTION", value });
const setLayout = (dispatch, value) => dispatch({ type: "LAYOUT", value });
const setDarkMode = (dispatch, value) => dispatch({ type: "DARKMODE", value });
const setConnected = (dispatch, value) => dispatch({ type: "CONNECTED", value });
const initSensorData = (dispatch, value) => dispatch({ type: "INIT_SENSOR_DATA", value });
const appendSensorData = (dispatch, value) => dispatch({ type: "APPEND_SENSOR_DATA", value });
const setDataReceived = (dispatch) => dispatch({ type: "ALL_DATA_RECEIVED" });

export {
  MaterialUIControllerProvider,
  useMaterialUIController,
  setMiniSidenav,
  setTransparentSidenav,
  setWhiteSidenav,
  setSidenavColor,
  setTransparentNavbar,
  setFixedNavbar,
  setOpenConfigurator,
  setDirection,
  setLayout,
  setDarkMode,
  setConnected,
  initSensorData,
  appendSensorData,
  setDataReceived,
};
