import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";
import App from "App";

// Material Dashboard 2 React Context Provider
import { MaterialUIControllerProvider } from "context/MaterialUIProvider";
import { SensorProvider } from "context/SensorProvider";

ReactDOM.render(
  <BrowserRouter>
    <MaterialUIControllerProvider>
      <SensorProvider>
        <App />
      </SensorProvider>
    </MaterialUIControllerProvider>
  </BrowserRouter>,
  document.getElementById("root")
);
