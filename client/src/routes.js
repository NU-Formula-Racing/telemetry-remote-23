/**
=========================================================
* Material Dashboard 2 React - v2.1.0
=========================================================

* Product Page: https://www.creative-tim.com/product/material-dashboard-react
* Copyright 2022 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com

 =========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/

/** 
  All of the routes for the Material Dashboard 2 React are added here,
  You can add a new route, customize the routes and delete the routes here.

  Once you add a new route on this file it will be visible automatically on
  the Sidenav.

  For adding a new route you can follow the existing routes in the routes array.
  1. The `type` key with the `collapse` value is used for a route.
  2. The `type` key with the `title` value is used for a title inside the Sidenav. 
  3. The `type` key with the `divider` value is used for a divider between Sidenav items.
  4. The `name` key is used for the name of the route on the Sidenav.
  5. The `key` key is used for the key of the route (It will help you with the key prop inside a loop).
  6. The `icon` key is used for the icon of the route on the Sidenav, you have to add a node.
  7. The `collapse` key is used for making a collapsible item on the Sidenav that has other routes
  inside (nested routes), you need to pass the nested routes inside an array as a value for the `collapse` key.
  8. The `route` key is used to store the route location which is used for the react router.
  9. The `href` key is used to store the external links location.
  10. The `title` key is only for the item with the type of `title` and its used for the title text on the Sidenav.
  10. The `component` key is used to store the component of its route.
*/

// Material Dashboard 2 React layouts
import Dashboard from "layouts/dashboard";
import Tables from "layouts/tables";
// import Notifications from "layouts/notifications";

// @mui icons
import Icon from "@mui/material/Icon";

const routes = [
  {
    type: "collapse",
    name: "Sessions",
    key: "sessions",
    icon: <Icon fontSize="small">table_view</Icon>,
    route: "/sessions",
    component: <Tables />,
  },
  {
    type: "collapse",
    name: "Wheel, Break, Motor Temp.", //name of page
    key: "wbm", // key, unique too
    icon: <Icon fontSize="small">dashboard</Icon>,
    route: "/wbm", // if you change this also change in handleSelect in the table layout component
    component: (
      <Dashboard
        sensorGroups={[
          [0, 1, 2, 3],
          [4],
          [25, 26, 27, 28],
          [5, 6],
          [12],
          [23, 24]
        ]}
      />
    ),
  },
  {
    type: "collapse",
    name: "Accel and Gyro", //name of page
    key: "accel and gyro",
    icon: <Icon fontSize="small">dashboard</Icon>,
    route: "/accel_gyro",
    component: <Dashboard sensorGroups={[[13, 14, 15], [16, 17, 18]]} />,
  },
  {
    type: "collapse",
    name: "Battery Related [Fast]", //name of page
    key: "battery_realted",
    icon: <Icon fontSize="small">dashboard</Icon>,
    route: "/battery_related",
    component: <Dashboard sensorGroups={[[7], [8], [9, 10, 11]]} />,
  },
  {
    type: "collapse",
    name: "Misc [Fast]", //name of page
    key: "misc_fast_sensors",
    icon: <Icon fontSize="small">dashboard</Icon>,
    route: "/misc_fast_sensors",
    component: <Dashboard sensorGroups={[[19, 20], [21]]} />,
  },
  {
    type: "collapse",
    name: "Misc [Slow]", //name of page
    key: "misc_slow_sensors",
    icon: <Icon fontSize="small">dashboard</Icon>,
    route: "/misc_slow_sensors",
    component: <Dashboard sensorGroups={[[29, 30, 31], [32], [33]]} />,
  },
  // this page is for demoing how to use notifications on the client side
  // {
  //   type: "collapse",
  //   name: "Notifications",
  //   key: "notifications",
  //   icon: <Icon fontSize="small">notifications</Icon>,
  //   route: "/notifications",
  //   component: <Notifications />,
  // },
];

export default routes;
