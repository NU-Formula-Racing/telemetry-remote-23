// Material Dashboard 2 React contexts
import { useMaterialUIController } from "context/MaterialUIProvider";
// import "chartjs-plugin-zoom";

function configs(titles) {
  const [muiController] = useMaterialUIController();
  const { darkMode } = muiController;
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
        // decimation: {
        //   enabled: false,
        //   algorithm: "min-max",
        // },
        zoom: {
          pan: {
            enabled: false,
            mode: "x",
            scaleMode: "x",
            onPanComplete: ({ chart }) => {
              const { min, max } = chart.scales.x;
              if (min >= max) {
                console.log(`%cEP: ${chart.scales.x.min} ${chart.scales.x.max}`, "color: red;");
              } else {
                console.log(`PP: ${chart.scales.x.min} ${chart.scales.x.max}`);
              }
              // if (min >= max) {
              //   chart.scales.x.min = chart.options.plugins.zoom.limits.x.min;
              //   chart.scales.x.max = chart.options.plugins.zoom.limits.x.max;
              //   chart.update();
              // }
              // for (let i = 0; i < chart.data.datasets.length; i += 1) {
              //   chart.data.datasets[i].data = [50, ...chart.data.datasets[i].data];
              //   if (chart.data.labels.length < chart.data.datasets[i].data.length) {
              //     const firstTime = chart.data.labels[0];
              //     chart.data.labels.push(firstTime - 0.1);
              //     chart.scales.x.min -= 1;
              //   }
              // }
            },
          },
          limits: {
            x: {
              min: "original",
              max: "original",
              minRange: 20,
            },
          },
          zoom: {
            wheel: {
              enabled: false,
              mode: "x",
              speed: 0.1,
            },
            mode: "x",
            speed: 0.1,
            onZoomComplete: ({ chart }) => {
              // chart.update();
              const { min, max } = chart.scales.x;
              if (min >= max) {
                console.log(`%cEZ: ${chart.scales.x.min} ${chart.scales.x.max}`, "color: red;");
              } else {
                console.log(`ZZ: ${chart.scales.x.min} ${chart.scales.x.max}`);
              }
              if (min >= max) {
                const copyMin = chart.options.plugins.zoom.limits.x.min;
                const copyMax = chart.options.plugins.zoom.limits.x.max;
                chart.scales.x.min = copyMin;
                chart.scales.x.max = copyMax;
              }
            },
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
          // type: "time",
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
            minRotation: 0,
            maxRotation: 0,
            maxTicksLimit: 5,
            autoSkip: true,
            font: {
              size: 14,
              weight: 300,
              family: "Roboto",
              style: "normal",
              lineHeight: 2,
            },
            callback: function (val) {
              // const newThis = this;
              if (!this || this === undefined) return val;

              return this.getLabelForValue(val).substr(0, 8);
            },
          },
        },
      },
    },
  };
}

export default configs;

/**
*   for mouse panning and zoom wheel can use plugin
*   https://www.chartjs.org/chartjs-plugin-zoom/latest/guide/options.html
*   solution: adjust scale and not data array when scaling normally
*   bug: when zooming out and panning left, chart will disappear
*   scale bounds go crazy if pan too much to left side
*   zoom keeps getting reset to max zoom if zoom out too much
*   pan zoom misbehaves at around the same index
*   hypothesis: graph on left is rendered, bug with source code itself
*   also possible to have something to do with useMemo. Not sure tho
*   possible fix: use onPan/onZoom to update and redraw the chart
*   current code: zoom and pan works on small scale movements:
*   in component file add:
        import zoomPlugin from "chartjs-plugin-zoom";
        Chart.register(zoomPlugin);
*   in config file under options.plugins add:
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
              // chart.update();
              const { min, max } = chart.scales.x;
              if (min >= max) {
                console.log(`%cEP: ${chart.scales.x.min} ${chart.scales.x.max}`, "color: red;");
              } else {
                console.log(`PP: ${chart.scales.x.min} ${chart.scales.x.max}`);
              }
            },
          },
          limits: {
            x: {
              min: 0,
              max: "original",
              minRange: 20,
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
            onZoomComplete: ({ chart }) => {
              // chart.update();
              const { min, max } = chart.scales.x;
              if (min >= max) {
                console.log(`%cEZ: ${chart.scales.x.min} ${chart.scales.x.max}`, "color: red;");
              } else {
                console.log(`ZZ: ${chart.scales.x.min} ${chart.scales.x.max}`);
              }
            },
          },
        },
*/
