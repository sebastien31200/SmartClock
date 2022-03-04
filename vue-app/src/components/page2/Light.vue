<template>
  <div>
    <v-card elevation="10" class="ma-1 pa-3 mt-2" width="350">
      <v-row no-gutters class="mt-1 mb-5">
        <v-icon
          large
          :color="isOn ? '#2196f3' : 'white'"
          @click="setAllLightsOnOff"
          >mdi-lightbulb-on-outline</v-icon
        >
        <v-slider
          thumb-label
          v-model="lightValue"
          min="0"
          max="100"
          v-on:end="setAllLights(lightValue)"
          hide-details
          class="ml-3"
        ></v-slider>
      </v-row>
      <v-row no-gutters>
        <v-btn
          class="mx-2"
          fab
          dark
          style="border: thin solid #CCCCCC;"
          @click="setKitchenLightOnly()"
        >
          <v-icon dark>mdi-ceiling-light</v-icon>
        </v-btn>
        <v-btn
          class="mx-2"
          fab
          dark
          color="yellow lighten-1"
          @click="setAllLights(100, 8597, 120)"
        >
          <v-icon dark>mdi-weather-sunny</v-icon>
        </v-btn>
        <v-btn
          class="mx-2"
          fab
          dark
          color="orange darken-2"
          @click="setAllLights(60, 7676, 200)"
        >
          <v-icon dark>mdi-weather-night</v-icon>
        </v-btn>
        <v-btn
          class="mx-2"
          fab
          dark
          color="pink darken-1"
          @click="blinkLights()"
        >
          <v-icon dark>mdi-party-popper</v-icon>
        </v-btn>
      </v-row>
    </v-card>
  </div>
</template>

<script>
import axios from "axios";
import { apiSettings } from "./Page2Utils";

export default {
  data: function() {
    return {
      lightValue: 0,
      lights: {
        tv: { id: 1, status: false },
        kitchen: { id: 2, status: false },
        floor: { id: 3, status: false }
      },
      blink: false
    };
  },
  computed: {
    isOn: function() {
      return (
        this.lights.tv.status ||
        this.lights.kitchen.status ||
        this.lights.floor.status
      );
    }
  },
  mounted: function() {
    axios.get(apiSettings.hueApiURl).then(response => {
      this.lights.tv.status = response.data[this.lights.tv.id].state.on;
      this.lights.kitchen.status =
        response.data[this.lights.kitchen.id].state.on;
      this.lights.floor.status = response.data[this.lights.floor.id].state.on;

      var brigthness = 0;
      if (this.lights.kitchen.status) {
        brigthness = response.data[this.lights.kitchen.id].state.bri;
      } else if (this.lights.tv.status) {
        brigthness = response.data[this.lights.tv.id].state.bri;
      }
      this.lightValue = Math.round((brigthness * 100) / 255);
    });
  },
  methods: {
    setAllLightsOnOff: function() {
      var status = !this.isOn;
      this.blink = false;
      this.setLightStatus(this.lights.kitchen, status);
      this.setLightStatus(this.lights.tv, status);
      this.setLightStatus(this.lights.floor, status);
    },
    setLightStatus: function(light, status) {
      light.status = status;
      var putUrl = apiSettings.hueApiURl + "/" + light.id + "/state";
      console.log("Set light " + light.id + " state to: " + status);
      axios.put(putUrl, { on: status });
    },
    setAllLights: function(bri, hue, sat) {
      this.blink = false;
      var brightness = Math.round((bri * 255) / 100);
      this.setLightValue(this.lights.tv, brightness, hue, sat);
      this.setLightValue(this.lights.kitchen, brightness, hue, sat);
      this.setLightValue(this.lights.floor, brightness, hue, sat);
    },
    setLightValue: function(light, brightness, hue, sat) {
      var putUrl = apiSettings.hueApiURl + "/" + light.id + "/state";
      light.status = true;
      if (hue == undefined || sat == undefined) {
        axios.put(putUrl, { on: true, bri: brightness });
      } else {
        axios.put(putUrl, { on: true, bri: brightness, hue: hue, sat: sat });
      }
      console.log(light.id + " -> Set light brigthness to: " + brightness);
    },
    setKitchenLightOnly: function() {
      this.setLightStatus(this.lights.tv, false);
      this.setLightStatus(this.lights.floor, false);
      this.setLightStatus(this.lights.kitchen, true);
    },
    blinkLights: async function() {
      this.$root.$emit("countdownRunning", "true");
      var lights = [1, 3, 2];
      var colors = {
        blue: [202, 41743, 223],
        red: [202, 528, 203],
        yellow: [202, 12000, 254],
        purple: [202, 48045, 250],
        cyan: [202, 37331, 254]
      };
      this.blink = !this.blink;
      while (this.blink) {
        //Random color
        const keys = Object.keys(colors);
        const prop = keys[Math.floor(Math.random() * keys.length)];
        var color = colors[prop];
        for (let i = 0; i < lights.length; i++) {
          var lightID = lights[i];

          var putUrl = apiSettings.hueApiURl + "/" + lightID + "/state";
          var brightness = color[0];
          var hue = color[1];
          var sat = color[2];
          axios.put(putUrl, { on: true, bri: brightness, hue: hue, sat: sat });
          await this.sleep(300);
          axios.put(putUrl, { on: true, bri: 100, hue: hue, sat: sat });
          await this.sleep(100);
        }
      }
      this.$root.$emit("countdownRunning", "false");
      this.setAllLights(60, 7676, 200);
    },

    sleep: function(ms) {
      return new Promise(resolve => setTimeout(resolve, ms));
    }
  }
};
</script>