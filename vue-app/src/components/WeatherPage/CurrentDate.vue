<template>
  <div id="current-date">
    <v-list-item two-line>
      <div>
        <v-list-item-title class="display-4 ml-4" style="line-height: 1em">{{time}}</v-list-item-title>
        <v-list-item-subtitle class="headline">{{date}}</v-list-item-subtitle>
      </div>
    </v-list-item>
  </div>
</template>

<script>
import { getDayOfWeek } from "./WeatherUtils";
import { getMonth } from "./WeatherUtils";

export default {
  data: function() {
    return {
      hours: 12,
      minutes: 0,
      seconds: 0,
      dayOfWeek: "Lundi",
      day: 1,
      month: "Janvier",
      year: 2000
    };
  },

  computed: {
    time: function() {
      return this.hours + ":" + this.minutes;
    },
    date: function() {
      return (
        this.dayOfWeek + " " + this.day + " " + this.month + " " + this.year
      );
    }
  },

  mounted: function() {
    this.startTime();
  },

  destroyed: function() {
    clearTimeout(this.$timeout);
  },

  methods: {
    startTime: function() {
      var today = new Date();
      var h = today.getHours();
      var m = today.getMinutes();
      var s = today.getSeconds();

      this.hours = this.checkTime(h);
      this.minutes = this.checkTime(m);
      this.seconds = this.checkTime(s);

      this.dayOfWeek = getDayOfWeek(today);
      this.day = today.getUTCDate();
      this.month = getMonth([today.getUTCMonth()]);
      this.year = today.getFullYear();
      this.$timeout = setTimeout(this.startTime, 500);
    },

    checkTime: function(i) {
      if (i < 10) {
        i = "0" + i;
      } // add zero in front of numbers < 10
      return i;
    },

    rgbToHex: function(rgb) {
      var hex = Number(rgb).toString(16);
      if (hex.length < 2) {
        hex = "0" + hex;
      }
      return hex;
    }
  }
};
</script>