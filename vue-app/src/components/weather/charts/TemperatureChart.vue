<template>
  <div class="ml-2 mr-3" style="max-height:140px;margin-top:40px">
    <VueApexChart height="140" type="line" :options="options" :series="series"></VueApexChart>
  </div>
</template>

<script>
import VueApexChart from "vue-apexcharts";

export default {
  components: { VueApexChart },
  props: {
    temperatureArray: { type: Array, required: true },
    precipitationArray: { type: Array, required: true },
    timesArray: { type: Array, required: true }
  },

  computed: {
    series: function() {
      var series = [
        {
          name: "temperatures",
          data: this.temperatureArray
        },
        {
          name: "precipitations",
          type: "column",
          data: this.precipitationArray
        }
      ];

      return series;
    }
  },
  data: function() {
    return {
      options: {
        chart: {
          id: "tempChart",
          toolbar: { show: false }
        },
        colors: ["#1e88e5", "#81d4fa"],
        fill: {
          opacity: [1, 0.6]
        },
        plotOptions: {
          bar: {
            horizontal: false,
            columnWidth: "15%",
            endingShape: "rounded"
          }
        },
        theme: {
          mode: "light"
        },
        tooltip: {
          enabled: false,
          offsetX: 0
        },
        stroke: {
          curve: "smooth",
          width: [2, 1]
        },
        grid: {
          show: false
        },
        legend: {
          show: false
        },
        dataLabels: {
          enabled: true,
          enabledOnSeries: [0, 1],
          offsetY: -5,
          style: {
            fontSize: "20px"
          },
          background: {
            enabled: false
          }
        },
        xaxis: {
          categories: this.$props.timesArray,
          labels: {
            style: {
              colors: "white",
              fontSize: "14px",
              fontFamily: "Roboto",
              cssClass: "apexcharts-xaxis-label"
            }
          },
          axisBorder: {
            show: false
          },
          axisTicks: {
            show: false
          }
        },
        yaxis: [
          {
            show: false
          },
          {
            show: false,
            max: 10
          }
        ]
      }
    };
  },
  watch: {
    // whenever times changes, this function will run
    timesArray: function(newTimes) {
      this.options = {
        xaxis: {
          categories: newTimes
        }
      };
    }
  }
};
</script>

<style>
@import url(https://fonts.googleapis.com/css?family=Roboto);

body {
  font-family: Roboto, sans-serif;
}

#chart {
  margin: 35px auto;
}
</style>