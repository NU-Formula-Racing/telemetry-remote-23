/* eslint-disable react/prop-types */
/* eslint-disable react/function-component-definition */

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

// @mui material components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";

// Material Dashboard 2 React example components
import DashboardLayout from "custom/LayoutContainers/DashboardLayout";
import NavBar from "custom/Navbar";
import DataTable from "custom/DataTable";

import {
  Status,
  useSensorController,
  initSensorData,
  setStatus,
  setSessionData,
} from "context/SensorProvider";

const Session = ({ name, id }) => (
  <MDBox display="flex" alignItems="center" lineHeight={1}>
    <MDBox lineHeight={1}>
      <MDTypography display="block" variant="button" fontWeight="medium">
        {name}
      </MDTypography>
      {/* this id refers to id in sqlite db */}
      <MDTypography variant="caption">Session ID: {id}</MDTypography>
    </MDBox>
  </MDBox>
);

const Timestamp = ({ date, time }) => (
  <MDBox lineHeight={1} textAlign="left">
    <MDTypography display="block" variant="caption" color="text" fontWeight="medium">
      {date}
    </MDTypography>
    <MDTypography variant="caption">{time}</MDTypography>
  </MDBox>
);

const ActionButton = ({ color, text, disabled, onClick }) => (
  <MDButton color={color} onClick={onClick} disabled={disabled}>
    <MDTypography variant="button" color="text" fontWeight="medium">
      {text}
    </MDTypography>
  </MDButton>
);

function Tables() {
  const [sensorController, sensorDispatch] = useSensorController();
  const { status, sessionData, socket } = sensorController;

  const handleInitSensorData = (res) => initSensorData(sensorDispatch, res);
  const handleSetStatus = (res) => setStatus(sensorDispatch, res);
  // const handleSetSessionData = (res) => setSessionData(sensorDispatch, res);

  const navigate = useNavigate();
  const handleSelect = (id) => {
    console.log(); // FIXME: state from row componenets will not update
    // FIXME: need error response to ask user to restart again
    if (socket && socket.connected) {
      handleSetStatus(Status.FETCHING);
      console.log("tables: send initializeSession");
      socket.emit("initializeSession", id, (res) => {
        console.log("tables: initializeSession response", res);
        if (Object.keys(res.data).length > 0 && res.data[Object.keys(res.data)[0]].length > 0) {
          handleInitSensorData(res.data);
          console.log("tables: response length", res.data.length);
        }
        handleSetStatus(Status.LIVE);
        navigate("/dashboard");
      });
    } else {
      console.log("tables: socket not connected");
    }
  };

  const handleDelete = (id) => {
    if (status === Status.CONNECTED && socket) {
      console.log("tables: send deleteSession");
      socket.emit("deleteSession", id, (res) => {
        console.log("tables: deleteSession response", res);
      });
      setSessionData(
        sensorDispatch,
        sessionData.filter((session) => session.id !== id)
      );
    } else {
      console.log("tables: socket not connected");
    }
  };

  const columns = [
    { Header: "session", accessor: "session", width: "45%", align: "left" },
    { Header: "last updated", accessor: "lastUpdated", align: "left" },
    { Header: "select session", accessor: "select", width: "10%", align: "center" },
    { Header: "delete session", accessor: "delete", width: "10%", align: "center" },
  ];

  function dataRow({
    argName,
    argId,
    argDate,
    argTime,
    onSelect,
    onDelete,
    disableSelect = false,
    disableDelete = false,
  }) {
    // TODO: (extra) add snackbar response for server events
    return {
      session: <Session name={argName} id={argId} />,
      lastUpdated: <Timestamp date={argDate} time={argTime} />,
      select: ActionButton({
        color: "success",
        text: "select",
        onClick: onSelect,
        disabled: disableSelect,
      }),
      delete: ActionButton({
        color: "error",
        text: "delete",
        onClick: onDelete,
        disabled: disableDelete,
      }),
    };
  }

  const defaultRow = dataRow({
    argName: "CREATE NEW SESSION",
    argId: "n/a",
    argDate: "",
    argTime: "",
    onSelect: () => handleSelect("n/a"),
    onDelete: () => handleDelete("n/a"),
    // disableSelect: true,
    disableDelete: true,
  });

  const newRow = (session) =>
    dataRow({
      argName: session.name,
      argId: session.id,
      argDate: "some date",
      argTime: "some time",
      onSelect: () => handleSelect(session.id),
      onDelete: () => handleDelete(session.id),
      disableDelete: false,
    });
  // console.log("tables: addRow", session);

  // fetch current rows from sessionData state
  const getRows = () => {
    const newRows = [defaultRow];
    if (sessionData && sessionData.length > 0) {
      sessionData.forEach((session) => {
        newRows.push(newRow(session));
      });
    }
    return newRows;
  };

  const [rows, setRows] = useState(getRows());

  // refresh table everytime sessionData changes
  useEffect(() => {
    setRows(getRows());
  }, []);
  useEffect(() => {
    setRows(getRows());
  }, [sessionData, status]);

  // disable table buttons when not connected
  useEffect(() => {
    // console.log("tables: status", status);
    const newRows = rows.map((row) => ({
      ...row,
      // onSelect: () => handleSelect(row.session.id),
      disableSelect: !(socket && socket.connected),
      disableDelete: !(socket && socket.connected),
    }));
    setRows(newRows);
  }, [status]);

  // const { columns: pColumns, rows: pRows } = projectsTableData();
  return (
    <DashboardLayout>
      <NavBar />
      <MDBox pt={6} pb={3}>
        <Grid container spacing={6}>
          <Grid item xs={12}>
            <Card>
              <MDBox
                mx={2}
                mt={-3}
                py={3}
                px={2}
                variant="contained"
                bgColor="dark"
                borderRadius="lg"
              >
                <MDTypography variant="h6" color="white">
                  Sessions
                </MDTypography>
              </MDBox>
              <MDBox pt={3}>
                <DataTable
                  table={{ columns, rows }}
                  isSorted={false}
                  entriesPerPage={false}
                  showTotalEntries={false}
                  noEndBorder
                />
              </MDBox>
            </Card>
          </Grid>
        </Grid>
      </MDBox>
    </DashboardLayout>
  );
}

export default Tables;
