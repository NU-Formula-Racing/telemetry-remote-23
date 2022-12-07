// @mui material components
import Grid from "@mui/material/Grid";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";

// Material Dashboard 2 React example components
import DashboardLayout from "custom/LayoutContainers/DashboardLayout";
import NavBar from "custom/Navbar";
import DefaultLineChart from "custom/Charts/DefaultLineChart";
import StatisticsCard from "custom/Cards/StatisticsCard";

// Data
import reportsLineChartData from "layouts/dashboard/data/reportsLineChartData";

// Dashboard components
function Dashboard() {
  const { sales, tasks } = reportsLineChartData;

  return (
    <DashboardLayout>
      <NavBar />
      <MDBox>
        <MDBox>
          <Grid container spacing={3}>
            <Grid item xs={12} md={12} lg={12}>
              <MDBox>
                <DefaultLineChart
                  color="dark"
                  title="Wheel Speed"
                  description={
                    <>
                      <strong>500</strong> rpm
                    </>
                  }
                  chart={sales}
                />
              </MDBox>
            </Grid>
            <Grid item xs={12} md={12} lg={12}>
              <MDBox mb={3}>
                <DefaultLineChart
                  color="dark"
                  title="Brake Pressure"
                  description={
                    <>
                      <strong>90</strong> Units
                    </>
                  }
                  chart={tasks}
                />
              </MDBox>
            </Grid>
          </Grid>
        </MDBox>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <StatisticsCard
                color="dark"
                icon="weekend"
                title="FR Brake Temp"
                count={88}
                percentage={{
                  color: "success",
                  amount: "+55%",
                  label: "than lask week",
                }}
              />
            </MDBox>
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <StatisticsCard
                icon="leaderboard"
                title="FL Brake Temp"
                count={87}
                percentage={{
                  color: "success",
                  amount: "+3%",
                  label: "than last month",
                }}
              />
            </MDBox>
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <StatisticsCard
                color="success"
                icon="store"
                title="BR Brake Temp"
                count={87}
                percentage={{
                  color: "success",
                  amount: "+1%",
                  label: "than yesterday",
                }}
              />
            </MDBox>
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <StatisticsCard
                color="primary"
                icon="person_add"
                title="BL Brake Temp"
                count={90}
                percentage={{
                  color: "success",
                  amount: "",
                  label: "Just updated",
                }}
              />
            </MDBox>
          </Grid>
        </Grid>
      </MDBox>
    </DashboardLayout>
  );
}

export default Dashboard;
