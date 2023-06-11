<template>
  <div style="max-height:200px">
    <WindChart :windSpeedSeries="windSpeedArray" :windDirSeries="windDirArray"></WindChart>
    <TemperatureChart
      :temperatureArray="temperatureArray"
      :precipitationArray="precipitationArray"
      :timesArray="timesArray"
    ></TemperatureChart>
    <WeatherIconChart :weatherIconArray="weatherIconArray"></WeatherIconChart>
  </div>
</template>

<script>
import TemperatureChart from "./TemperatureChart";
import WindChart from "./WindChart";
import WeatherIconChart from "./WeatherIconChart";

export default {
  components: { TemperatureChart, WeatherIconChart, WindChart },
  props: {
    temperatureArray: { type: Array, required: true },
    precipitationArray: { type: Array, required: true },
    windSpeedArray: { type: Array, required: true },
    windDirArray: { type: Array, required: true },
    weatherIconArray: { type: Array, required: true },
    timesArray: { type: Array, required: true }
  }
};
</script>
