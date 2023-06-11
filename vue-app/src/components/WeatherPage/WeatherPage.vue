<template>
  <v-div height="100%">
    <v-card elevation="10">
      <div class="d-flex flex-no-wrap">
        <CurrentDate></CurrentDate>
        <CurrentWeather
          :temperature="currentTemperature"
          :windSpeed="currentWindSpeed"
          :weatherIcon="currentWeatherIcon"
        ></CurrentWeather>
      </div>
    </v-card>
    <v-card elevation="10" >
      <DailyCharts
        :temperatureArray="hourlyTemperatureArray"
        :precipitationArray="hourlyPrecipitationArray"
        :windSpeedArray="hourlyWindSpeedArray"
        :windDirArray="hourlyWindDirArray"
        :weatherIconArray="hourlyWeatherIconArray"
        :timesArray="hourlyTimesArray"
      ></DailyCharts>
    </v-card>
    <ForecastWeather
      v-for="forecast in weatherForecasts"
      v-bind:key="forecast.date"
      :date="forecast.date"
      :tempMin="forecast.tempMin"
      :tempMax="forecast.tempMax"
      :windSpd="forecast.windSpd"
      :precMm="forecast.precMm"
      :weatherIcon="forecast.weatherIcon"
    ></ForecastWeather>
  </v-div>
</template>

<script>
import CurrentDate from "./CurrentDate";
import CurrentWeather from "./CurrentWeather";
import ForecastWeather from "./ForecastWeather";
import DailyCharts from "./charts/DailyCharts";

import axios from "axios";

import { getDayOfWeek } from "./WeatherUtils";
import { openMeteoApiSettings } from "./WeatherUtils";
import { weatherCodeToSvg } from "./WeatherUtils";

export default {
  components: {
    CurrentDate,
    CurrentWeather,
    DailyCharts,
    ForecastWeather
  },

  data() {
    return {
      currentTemperature: 20,
      currentWindSpeed: 5,
      currentWeatherIcon: "fog.svg",
      hourlyTemperatureArray: [],
      hourlyPrecipitationArray: [],
      hourlyWindSpeedArray: [],
      hourlyWindDirArray: [],
      hourlyWeatherIconArray: [],
      hourlyCurrentTemperatureArray: [],
      hourlyTimesArray: [],
      weatherForecasts: []
    };
  },

  methods: {
    updateWeather() {
      console.log("Update weather");
      this.updateHourlyForecast();
      this.updateDailyForecast();
    },
    updateHourlyForecast() {
      axios.get(openMeteoApiSettings.hourlyApiUrl).then(response => {
        var data = response.data;

        //Current weather
        var currentWeather = data.current_weather;
        this.currentTemperature = Math.round(currentWeather.temperature);
        this.currentWindSpeed = Math.round(currentWeather.windspeed);
        this.currentWeatherIcon =
          weatherCodeToSvg[currentWeather.weathercode] + ".svg";
        //Hourly forecast weather
        var hourlyForecasts = data.hourly;

        this.hourlyTimesArray = [];
        this.hourlyTemperatureArray = [];
        this.hourlyPrecipitationArray = [];
        this.hourlyWindSpeedArray = [];
        this.hourlyWindDirArray = [];
        this.hourlyWeatherIconArray = [];

        var currentTime = new Date();
        var currentHour = currentTime.getHours(); //Daily forecast starts at midnight 
        var maxTimeForecast = currentHour + 12; //12hours
        for (var i = currentHour; i < maxTimeForecast; i++) {
          if (i % 2 == 0) {
            var date = new Date(hourlyForecasts.time[i]);
            var time = date.getHours() + "h";
            console.log(date)
            var temperature = Math.round(hourlyForecasts.temperature_2m[i]);
            var precipitation = Math.round(hourlyForecasts.precipitation[i]); //mm/hr
            var windSpeed = Math.round(hourlyForecasts.windspeed_10m[i]);
            var windDir = Math.round(hourlyForecasts.winddirection_10m[i]);

            this.hourlyTimesArray.push(time);
            this.hourlyTemperatureArray.push(temperature);
            this.hourlyPrecipitationArray.push(precipitation);
            this.hourlyWindSpeedArray.push(windSpeed);
            this.hourlyWindDirArray.push(windDir);
          } else {
            var weatherIcon =
              weatherCodeToSvg[hourlyForecasts.weathercode[i]] + ".svg";
            this.hourlyWeatherIconArray.push(weatherIcon);
          }
        }
      });
    },

    updateDailyForecast() {
      axios.get(openMeteoApiSettings.dailyApiUrl).then(response => {
        var data = response.data;
        var dailyForecast = data.daily;

        //3 days
        for (var i = 0; i <= 2; i++) {
          var high_temp = Math.round(dailyForecast.temperature_2m_max[i]);
          var low_temp = Math.round(dailyForecast.temperature_2m_min[i]);
          var windSpd = Math.round(dailyForecast.windspeed_10m_max[i]);
          var precMm = Math.round(dailyForecast.precipitation_sum[i]);
          var precProb = Math.round(dailyForecast.precipitation_hours[i]);
          var weatherIcon =
            weatherCodeToSvg[dailyForecast.weathercode[i]] + ".svg";

          var dateTime = new Date(dailyForecast.time[i]);
          var dateObj = new Date(dateTime);
          var dayOfWeek = getDayOfWeek(dateObj);
          var date = dayOfWeek + " " + dateObj.getDate();

          var weatherForecast = {
            date: date,
            tempMin: low_temp,
            tempMax: high_temp,
            windSpd: windSpd,
            precMm: precMm,
            precProb: precProb,
            weatherIcon: weatherIcon
          };
          this.weatherForecasts.push(weatherForecast);
        }
      });
    }
  },

  mounted: function() {
    this.updateWeather();
  }
};
</script>

<style>
:root {
  --temp-color: #1e88e5;
  --wind-color: #2b908f;
  --prec-color: #81d4fa;
}
.v-skeleton-loader__list-item-avatar-two-line {
  min-height: 70px;
  margin: 20px;
}
</style>