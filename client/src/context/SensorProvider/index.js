import { createContext, useContext, useReducer, useMemo } from "react";

// prop-types is a library for typechecking of props
import PropTypes from "prop-types";

const Sensor = createContext();

// Setting custom name for the context which is visible on react dev tools
Sensor.displayName = "SensorContext";

// Material Dashboard 2 React reducer
function reducer(state, action) {
  switch (action.type) {
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
function SensorProvider({ children }) {
  const initialState = {
    sensorData: {},
    dataReceived: false,
    connected: false,
  };

  const [sensorController, sensordispatch] = useReducer(reducer, initialState);

  const value = useMemo(
    () => [sensorController, sensordispatch],
    [sensorController, sensordispatch]
  );

  return <Sensor.Provider value={value}>{children}</Sensor.Provider>;
}

// Material Dashboard 2 React custom hook for using context
function useSensorController() {
  const context = useContext(Sensor);

  if (!context) {
    throw new Error("useSensorController should be used inside the SensorProvider.");
  }

  return context;
}

// Typechecking props for the SensorControllerProvider
SensorProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

// Context module functions
const setConnected = (dispatch, value) => dispatch({ type: "CONNECTED", value });
const initSensorData = (dispatch, value) => dispatch({ type: "INIT_SENSOR_DATA", value });
const appendSensorData = (dispatch, value) => dispatch({ type: "APPEND_SENSOR_DATA", value });
const setDataReceived = (dispatch) => dispatch({ type: "ALL_DATA_RECEIVED" });

export {
  SensorProvider,
  useSensorController,
  setConnected,
  initSensorData,
  appendSensorData,
  setDataReceived,
};
