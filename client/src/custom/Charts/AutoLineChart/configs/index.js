// Material Dashboard 2 React contexts
import { useMaterialUIController } from "context";
// import "chartjs-plugin-zoom";

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
      stepped: false,
      borderDash: [],
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
      animation: false,
      normalized: true,
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false,
        },
        zoom: {
          pan: {
            enabled: true,
            mode: "x",
            scaleMode: "x",
            // onPan: ({ chart }) => {
            // console.log(`panning`);
            // console.log(`min max: ${chart.scales.x.min} ${chart.scales.x.max}`);
            // },
            onPanComplete: ({ chart }) => {
              chart.update();
              console.log(`pan complete`);
              console.log(`min max: ${chart.scales.x.min} ${chart.scales.x.max}`);
            },
          },
          limits: {
            x: {
              min: 0,
              max: "original",
              minRange: 30,
            },
          },
          zoom: {
            wheel: {
              enabled: true,
              mode: "x",
              speed: 0.1,
            },
            mode: "x",
            speed: 0.1,
            // threshold: 2,
            // sensitivity: 3,
          },
        },
      },
      interaction: {
        intersect: false,
        mode: "index",
      },
      scales: {
        y: {
          type: "linear",
          // min: 0,
          // max: 100,
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
            display: false,
            drawOnChartArea: false,
            drawTicks: false,
          },
          ticks: {
            display: true,
            color: "#f8f9fa",
            padding: 5,
            maxRotation: 0,
            minRotation: 0,
            maxTicksLimit: 10,
            autoSkip: true,
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
