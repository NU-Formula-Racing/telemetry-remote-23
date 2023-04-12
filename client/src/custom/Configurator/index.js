// import { useEffect } from "react";

// @mui material components
import Divider from "@mui/material/Divider";
import Switch from "@mui/material/Switch";
import Icon from "@mui/material/Icon";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
// import MDButton from "components/MDButton";

// Custom styles for the Configurator
import ConfiguratorRoot from "custom/Configurator/ConfiguratorRoot";

// Material Dashboard 2 React context
import {
  useMaterialUIController,
  setOpenConfigurator,
  // setTransparentSidenav,
  // setWhiteSidenav,
  // setFixedNavbar,
  setDarkMode,
  setSidenavColor,
} from "context/MaterialUIProvider";

function Configurator() {
  const [muiController, muiDispatch] = useMaterialUIController();
  const { openConfigurator, darkMode } = muiController;
  // const [disabled, setDisabled] = useState(false);

  // // Use the useEffect hook to change the button state for the sidenav type based on window size.
  // useEffect(() => {
  //   // A function that sets the disabled state of the buttons for the sidenav type.
  //   // function handleDisabled() {
  //   //   return window.innerWidth > 1200 ? setDisabled(false) : setDisabled(true);
  //   // }

  //   // The event listener that's calling the handleDisabled function when resizing the window.
  //   // window.addEventListener("resize", handleDisabled);

  //   // Call the handleDisabled function to set the state with the initial value.
  //   // handleDisabled();

  //   // Remove event listener on cleanup
  //   // return () => window.removeEventListener("resize", handleDisabled);
  // }, []);

  const handleCloseConfigurator = () => setOpenConfigurator(muiDispatch, false);
  // const handleTransparentSidenav = () => {
  //   setTransparentSidenav(muiDispatch, true);
  //   setWhiteSidenav(muiDispatch, false);
  // };
  // const handleWhiteSidenav = () => {
  //   setWhiteSidenav(muiDispatch, true);
  //   setTransparentSidenav(muiDispatch, false);
  // };
  // const handleDarkSidenav = () => {
  //   setWhiteSidenav(muiDispatch, false);
  //   setTransparentSidenav(muiDispatch, false);
  // };
  // const handleFixedNavbar = () => setFixedNavbar(muiDispatch, !fixedNavbar);
  const handleDarkMode = () => {
    setDarkMode(muiDispatch, !darkMode);
    setSidenavColor(muiDispatch, darkMode ? "secondary" : "dark");
  };

  // sidenav type buttons styles
  // const sidenavTypeButtonsStyles = ({
  //   functions: { pxToRem },
  //   palette: { white, dark, background },
  //   borders: { borderWidth },
  // }) => ({
  //   height: pxToRem(39),
  //   background: darkMode ? background.sidenav : white.main,
  //   color: darkMode ? white.main : dark.main,
  //   border: `${borderWidth[1]} solid ${darkMode ? white.main : dark.main}`,

  //   "&:hover, &:focus, &:focus:not(:hover)": {
  //     background: darkMode ? background.sidenav : white.main,
  //     color: darkMode ? white.main : dark.main,
  //     border: `${borderWidth[1]} solid ${darkMode ? white.main : dark.main}`,
  //   },
  // });

  // // sidenav type active button styles
  // const sidenavTypeActiveButtonStyles = ({
  //   functions: { pxToRem, linearGradient },
  //   palette: { white, gradients, background },
  // }) => ({
  //   height: pxToRem(39),
  //   background: darkMode ? white.main : linearGradient(gradients.dark.main, gradients.dark.state),
  //   color: darkMode ? background.sidenav : white.main,

  //   "&:hover, &:focus, &:focus:not(:hover)": {
  //     background: darkMode ? white.main : linearGradient(gradients.dark.main, gradients.dark.state),
  //     color: darkMode ? background.sidenav : white.main,
  //   },
  // });

  return (
    <ConfiguratorRoot variant="permanent" ownerState={{ openConfigurator }}>
      <MDBox
        display="flex"
        justifyContent="space-between"
        alignItems="baseline"
        pt={4}
        pb={0.5}
        px={3}
      >
        <MDBox>
          <MDTypography variant="h5">Settings</MDTypography>
        </MDBox>

        <Icon
          sx={({ typography: { size }, palette: { dark, white } }) => ({
            fontSize: `${size.lg} !important`,
            color: darkMode ? white.main : dark.main,
            stroke: "currentColor",
            strokeWidth: "2px",
            cursor: "pointer",
            transform: "translateY(5px)",
          })}
          onClick={handleCloseConfigurator}
        >
          close
        </Icon>
      </MDBox>

      {/* <Divider /> */}

      <MDBox pt={0.5} pb={3} px={3}>
        {/* <MDBox mt={3} lineHeight={1}>
          <MDTypography variant="h6">Sidenav Type</MDTypography>
          <MDTypography variant="button" color="text">
            Choose between different sidenav types.
          </MDTypography>

          <MDBox
            sx={{
              display: "flex",
              mt: 2,
              mr: 1,
            }}
          >
            <MDButton
              color="dark"
              variant="gradient"
              onClick={handleDarkSidenav}
              disabled={disabled}
              fullWidth
              sx={
                !transparentSidenav && !whiteSidenav
                  ? sidenavTypeActiveButtonStyles
                  : sidenavTypeButtonsStyles
              }
            >
              Dark
            </MDButton>
            <MDBox sx={{ mx: 1, width: "8rem", minWidth: "8rem" }}>
              <MDButton
                color="dark"
                variant="gradient"
                onClick={handleTransparentSidenav}
                disabled={disabled}
                fullWidth
                sx={
                  transparentSidenav && !whiteSidenav
                    ? sidenavTypeActiveButtonStyles
                    : sidenavTypeButtonsStyles
                }
              >
                Transparent
              </MDButton>
            </MDBox>
            <MDButton
              color="dark"
              variant="gradient"
              onClick={handleWhiteSidenav}
              disabled={disabled}
              fullWidth
              sx={
                whiteSidenav && !transparentSidenav
                  ? sidenavTypeActiveButtonStyles
                  : sidenavTypeButtonsStyles
              }
            >
              White
            </MDButton>
          </MDBox>
        </MDBox> */}
        {/* <MDBox
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mt={3}
          lineHeight={1}
        >
          <MDTypography variant="h6">Navbar Fixed</MDTypography>

          <Switch checked={fixedNavbar} onChange={handleFixedNavbar} />
        </MDBox> */}
        {/* <Divider /> */}
        <MDBox display="flex" justifyContent="space-between" alignItems="center" lineHeight={1}>
          <MDTypography variant="h6">Light / Dark</MDTypography>
          <Switch checked={darkMode} onChange={handleDarkMode} />
        </MDBox>
        <Divider />
        <MDTypography variant="h5">Controls</MDTypography>
        <MDBox display="flex" justifyContent="space-between" alignItems="center" lineHeight={1}>
          <MDTypography variant="h6">w/s:</MDTypography>
          <MDTypography variant="body2">Zoom in/out on graphs</MDTypography>
        </MDBox>
        <MDBox display="flex" justifyContent="space-between" alignItems="center" lineHeight={1}>
          <MDTypography variant="h6">a/d:</MDTypography>
          <MDTypography variant="body2">pan left/right on graphs</MDTypography>
        </MDBox>
        <MDBox display="flex" justifyContent="space-between" alignItems="center" lineHeight={1}>
          <MDTypography variant="h6">shift + W/A/S/D:</MDTypography>
          <MDTypography variant="body2">zoom/pan 10x faster</MDTypography>
        </MDBox>
        <MDBox display="flex" justifyContent="space-between" alignItems="center" lineHeight={1}>
          <MDTypography variant="h6">shift + R:</MDTypography>
          <MDTypography variant="body2">resume live scrolling</MDTypography>
        </MDBox>
        <Divider />
        <MDTypography variant="h5">Usage</MDTypography>
        <MDBox display="flex" justifyContent="flex-start" alignItems="center" gap={1}>
          <MDTypography variant="h6">1.</MDTypography>
          <MDTypography variant="body2">Click connect to server.</MDTypography>
        </MDBox>
        <MDBox display="flex" justifyContent="flex-start" alignItems="center" gap={1}>
          <MDTypography variant="h6">2.</MDTypography>
          <MDTypography variant="body2">Navigate to sessions page.</MDTypography>
        </MDBox>
        <MDBox display="flex" justifyContent="flex-start" alignItems="center" gap={1}>
          <MDTypography variant="h6" ml={2}>
            2a.
          </MDTypography>
          <MDTypography variant="body2">Select session or create one.</MDTypography>
        </MDBox>
        <MDBox display="flex" justifyContent="flex-start" alignItems="center" gap={1}>
          <MDTypography variant="h6">3.</MDTypography>
          <MDTypography variant="body2">Data is live. Pan/zoom enabled</MDTypography>
        </MDBox>
        <Divider />
        <MDTypography variant="h5">F*ck. Things are broken</MDTypography>
        <MDTypography variant="body2">Try the below fixes in order.</MDTypography>
        <MDTypography variant="body2">Need to reslect the same session after.</MDTypography>
        <MDTypography variant="body2">(unless you restart the whole app)</MDTypography>
        <Divider />
        <MDBox display="flex" justifyContent="flex-start" alignItems="center" gap={1}>
          <MDTypography variant="h6">1.</MDTypography>
          <MDTypography variant="body2">Switch tabs on the side nav.</MDTypography>
        </MDBox>
        <MDBox display="flex" justifyContent="flex-start" alignItems="center" gap={1}>
          <MDTypography variant="h6">2.</MDTypography>
          <MDTypography variant="body2">Disconnect and reconnect to server.</MDTypography>
        </MDBox>
        <MDBox display="flex" justifyContent="flex-start" alignItems="center" gap={1}>
          <MDTypography variant="h6">3.</MDTypography>
          <MDTypography variant="body2">Refresh the tab.</MDTypography>
        </MDBox>
        <MDBox display="flex" justifyContent="flex-start" alignItems="center" gap={1}>
          <MDTypography variant="h6">4.</MDTypography>
          <MDTypography variant="body2">Relaunch the app entirely.</MDTypography>
        </MDBox>
        <MDBox display="flex" justifyContent="flex-start" alignItems="center" gap={1}>
          <MDTypography variant="h6">5.</MDTypography>
          <MDTypography variant="body2">Ping on slack.</MDTypography>
        </MDBox>
      </MDBox>
    </ConfiguratorRoot>
  );
}

export default Configurator;
