// Material Dashboard 2 React contexts
import { useMaterialUIController } from "context";

function configs(labels, datasets) {
  const [controller] = useMaterialUIController();
  const { darkMode } = controller;

  return {
    data: {
      labels,
      datasets: [
        {
          label: datasets.label,
          tension: 0,
          pointRadius: 0,
          pointBorderColor: "transparent",
          pointBackgroundColor: "transparent",
          borderColor: darkMode ? "rgba(227, 177, 250, .8)" : "rgba(225, 225, 225, .8)",
          borderWidth: 2,
          backgroundColor: "transparent",
          fill: true,
          data: datasets.data,
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
