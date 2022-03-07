<template>
  <div id="current-date" style="text-align: center">
    <div style="font-size: 8rem !important">{{ time }}</div>
    <v-row>
      <div id="in" v-bind:class="classSelector">
        <i class="text-h3 mdi mdi-home"></i>
        <v-list-item>
          <v-list-item-icon style="font-size: 40"
            ><v-icon class="pt-1" size="40"
              >mdi-thermometer</v-icon
            ></v-list-item-icon
          >
          <v-div class="text-h3" v-text="inTemperature"></v-div>
        </v-list-item>
        <v-list-item class="mt-1">
          <v-list-item-icon
            ><v-icon class="pt-1" size="40">mdi-water</v-icon></v-list-item-icon
          >
          <v-div class="text-h3" v-text="inHumidity"></v-div>
        </v-list-item>
      </div>
      <div class="vl" id="separator" v-if="!isMobile()"></div>

      <div id="out" v-bind:class="classSelector">
        <i class="text-h3 mdi mdi-pine-tree"></i>
        <v-list-item>
          <v-list-item-icon style="font-size: 40"
            ><v-icon class="pt-1" size="40"
              >mdi-thermometer</v-icon
            ></v-list-item-icon
          >
          <v-div class="text-h3" v-text="weatherTemperature"></v-div>
        </v-list-item>
        <v-list-item class="mt-1">
          <v-list-item-icon
            ><v-icon class="pt-1" size="40"
              >mdi-weather-windy</v-icon
            ></v-list-item-icon
          >
          <v-div class="text-h3" v-text="weatherWindSpeed"></v-div>
        </v-list-item>
      </div>
    </v-row>
  </div>
</template>
<style scoped></style>
<script>
import axios from "axios";
import { openMeteoApiSettings } from "./weather/WeatherUtils";

export default {
  data: function () {
    return {
      hours: 12,
      minutes: 0,
      seconds: 0,
      inTemperature: 0,
      inHumidity: 0,
      weatherTemperature: 0,
      weatherWindSpeed: 0,
      success: false,
    };
  },

  computed: {
    time: function () {
      return this.hours + ":" + this.minutes;
    },

    classSelector: function () {
      return {
        mobileClass: this.isMobile(),
      };
    },
  },

  mounted: function () {
    this.startTime();
    this.updateWeather();
    this.$socket.emit("getTemperature", "");
  },

  destroyed: function () {
    clearTimeout(this.$timeout);
  },

  sockets: {
    temperatureMessage(data) {
      this.inTemperature = data.temperature + " °C";
      this.inHumidity = Math.round(data.humidity) + " %";
    },
  },

  methods: {
    startTime: function () {
      var today = new Date();
      var h = today.getHours();
      var m = today.getMinutes();
      var s = today.getSeconds();

      this.hours = this.checkTime(h);
      this.minutes = this.checkTime(m);
      this.seconds = this.checkTime(s);
      this.$timeout = setTimeout(this.startTime, 2000);

      //Show daily citation at 7:00
      if (h == 7 && m == 0 && s < 2) {
        //console.log("Show citation");
        //this.$emit("showCitationMessage");
      }

      //Update weather periodically (2times/h)
      if ((m == 30 || m == 0) && s < 2) {
        this.updateWeather();
      }
    },

    checkTime: function (i) {
      if (i < 10) {
        i = "0" + i;
      } // add zero in front of numbers < 10
      return i;
    },

    updateWeather() {
      console.log("Update current temperature and wind");
      axios.get(openMeteoApiSettings.hourlyApiUrl).then((response) => {
        var data = response.data;

        //Current weather
        var currentWeather = data.current_weather;
        this.weatherTemperature =
          Math.round(currentWeather.temperature) + " °C";
        this.weatherWindSpeed = Math.round(currentWeather.windspeed) + " km/h";
        this.success = true;
      });
    },
    isMobile() {
      if (
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
          navigator.userAgent
        )
      ) {
        return true;
      } else {
        return false;
      }
    },
  },
};
</script>

<style scoped>
.vl {
  border-left: 1px solid white;
  margin-left: 40px;
  margin-right: 40px;
}
.mobileClass {
  display: inline-block;
  margin: 20px auto;
}
</style>
