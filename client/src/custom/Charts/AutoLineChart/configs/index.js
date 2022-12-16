// Material Dashboard 2 React contexts
import { useMaterialUIController } from "context";

function configs(titles) {
  const [controller] = useMaterialUIController();
  const { darkMode } = controller;
  // FIXME: figure how to change data colors based on dataset

  const darkModeColors = [
    // 03a9f4,
    "rgba(179, 136, 255, 1)",
    "rgba(130, 177, 255, 1)",
    "rgba(3, 218, 198, 1)",
    "rgba(207, 102, 121, 1)",
  ];
  const lightModeColors = [
    "rgba(156, 39, 176, 1)",
    "rgba(233, 30, 99, 1)",
    "rgba(0, 188, 212, 1)",
    "rgba(33, 150, 243, 1)",
  ];

  const datasetList = titles.map((title, i) => {
    const color = darkMode ? darkModeColors[i % 4] : lightModeColors[i % 4];
    return {
      label: title,
      tension: 0,
      pointRadius: 0,
      pointBorderColor: color,
      pointBackgroundColor: color,
      borderColor: color,
      borderWidth: 2,
      backgroundColor: "transparent",
      fill: true,
      data: [],
      maxBarThickness: 6,
    };
  });

  return {
    data: {
      labels: [],
      datasets: datasetList,
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
