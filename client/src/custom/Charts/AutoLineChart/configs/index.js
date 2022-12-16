// Material Dashboard 2 React contexts
import { useMaterialUIController } from "context";

function configs(titles) {
  const [controller] = useMaterialUIController();
  const { darkMode } = controller;
  // FIXME: figure how to change data colors based on dataset
  // const datasetList = titles.map((title) => ({
  //   label: title,
  //   tension: 0,
  //   pointRadius: 0,
  //   pointBorderColor: "transparent",
  //   pointBackgroundColor: "transparent",
  //   borderColor: darkMode ? "rgba(227, 177, 250, .8)" : "rgba(225, 225, 225, .8)",
  //   borderWidth: 2,
  //   backgroundColor: "transparent",
  //   fill: true,
  //   data: [],
  //   maxBarThickness: 6,
  // }));

  return {
    data: {
      labels: [],
      datasets: [
        {
          label: titles[0],
          tension: 0,
          pointRadius: 0,
          pointBorderColor: "transparent",
          pointBackgroundColor: "transparent",
          borderColor: darkMode ? "rgba(227, 177, 250, .8)" : "rgba(225, 225, 225, .8)",
          borderWidth: 2,
          backgroundColor: "transparent",
          fill: true,
          data: [],
          maxBarThickness: 6,
        },
        {
          label: titles[1],
          tension: 0,
          pointRadius: 0,
          pointBorderColor: "transparent",
          pointBackgroundColor: "transparent",
          borderColor: darkMode ? "rgba(227, 177, 250, .8)" : "rgba(225, 225, 225, .8)",
          borderWidth: 2,
          backgroundColor: "transparent",
          fill: true,
          data: [],
          maxBarThickness: 6,
        },
      ],
    },
    options: {
      animation: {
        duration: 0,
      },
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false,
        },
      },
      interaction: {
        intersect: false,
        mode: "index",
      },
      scales: {
        y: {
          grid: {
            drawBorder: false,
            display: true,
            drawOnChartArea: true,
            drawTicks: false,
            borderDash: [5, 5],
            color: "rgba(255, 255, 255, .2)",
          },
          ticks: {
            display: true,
            color: "#f8f9fa",
            padding: 10,
            font: {
              size: 14,
              weight: 300,
              family: "Roboto",
              style: "normal",
              lineHeight: 2,
            },
          },
        },
        x: {
          grid: {
            drawBorder: false,
            display: true,
            drawOnChartArea: false,
            drawTicks: true,
            borderDash: [5, 5],
          },
          ticks: {
            display: false,
            color: "#f8f9fa",
            padding: 10,
            font: {
              size: 14,
              weight: 300,
              family: "Roboto",
              style: "normal",
              lineHeight: 2,
            },
          },
        },
      },
    },
  };
}

export default configs;
