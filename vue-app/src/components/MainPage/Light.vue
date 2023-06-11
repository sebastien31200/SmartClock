<template>
  <div>
    <v-card elevation="10" class="ma-1 pa-3 mt-2" width="350">
      <v-row no-gutters class="mt-1 mb-5">
        <v-icon
          large
          :color="isOn ? '#2196f3' : 'white'"
          @click="setAllLightsOnOff()"
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
          v-bind:style="
            kitchenOnly
              ? 'border: 0.2em solid #2196f3'
              : 'border: thin solid #cccccc'
          "
          @click="setKitchenLight()"
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
export default {
  data: function () {
    return {
      lightValue: 0,
      lights: {
        tv: { id: 1, on: false },
        kitchen: { id: 2, on: false },
        floor: { id: 3, on: false },
      },
      kitchenOnly: false,
    };
  },
  computed: {
    isOn: function () {
      return (
        this.lights.tv.on || this.lights.kitchen.on || this.lights.floor.on
      );
    },
  },
  mounted: function () {
    this.$socket.emit("getAllLights");
  },
  sockets: {
    lightStatus(data) {
      //Receive light status from server
      console.log(data);
      this.lights.tv.on = data.tv.on;
      this.lights.kitchen.on = data.kitchen.on;
      this.lights.floor.on = data.floor.on;

      this.lightValue = Math.round((data.kitchen.bri * 100) / 255);
      console.log("value:" + this.lightValue);
    },
  },
  methods: {
    setAllLightsOnOff: function () {
      let status = !this.isOn;
      this.$socket.emit("setAllLights", { on: status });
    },
    setAllLights: function (bri, hue, sat) {
      var data = {};
      if (!this.isOn && !this.kitchenOnly) {
        data["on"] = true;
      }
      if (bri != undefined) {
        data["bri"] = Math.round((bri * 255) / 100);
      }
      if (hue != undefined) {
        data["hue"] = hue;
      }
      if (sat != undefined) {
        data["sat"] = sat;
      }
      console.log("setAllLights" + data);
      this.$socket.emit("setAllLights", data);
    },
    setKitchenLight: function () {
      this.kitchenOnly = !this.kitchenOnly;
      this.$socket.emit("setKitchenLight", { on: true });
    },
  },
};
</script>
