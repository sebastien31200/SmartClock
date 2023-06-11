<template>
  <v-card elevation="10" class="ma-1 pa-2">
    <audio id="audio" ref="audio">
      <source
        src="http://filipcicspagerprogramming.weebly.com/uploads/1/0/5/4/10541783/min5_tone_3.wav"
        type="audio/wav"
      />
      Your browser does not support the audio element.
    </audio>
    <v-progress-circular
      class="font-weight-bold display-1"
      :rotate="270"
      :size="130"
      :width="8"
      :value="timePct"
      color="green"
    >
      <v-col>
        <v-row style="transform: translateY(12px)" @click="incrementTimeLeft">
          {{ timeLeftString }}
        </v-row>
        <v-row
          style="
            display: inline-block;
            margin: auto;
            transform: translateY(18px);
          "
        >
          <v-btn icon color="green" dark @click="stopTimer"
            ><v-icon dark size="36"> mdi-stop </v-icon></v-btn
          >
        </v-row>
      </v-col>
    </v-progress-circular>
  </v-card>
</template>

<script>
  import axios from "axios";
  import { apiSettings } from "./MainPageUtils";

  export default {
    data: function () {
      return {
        timeLeftSeconds: 0,
        durationSeconds: 1,
        lights: [1, 2, 3],
        start: false,
        audio: undefined,
      };
    },

    mounted: function () {
      this.audio = this.$refs.audio;
    },

    computed: {
      timeLeftString: function () {
        if (this.timeLeftSeconds < 60) {
          var seconds = this.timeLeftSeconds;
          var minutes = 0;
        } else {
          seconds = this.timeLeftSeconds % 60;
          minutes = (this.timeLeftSeconds - seconds) / 60;
        }
        var secStr = ("0" + seconds).slice(-2);
        var minStr = ("0" + minutes).slice(-2);
        return minStr + ":" + secStr;
      },

      timePct: function () {
        return (this.timeLeftSeconds * 100) / this.durationSeconds;
      },
    },

    methods: {
      incrementTimeLeft: function () {
        this.timeLeftSeconds += 2 * 60;
        this.durationSeconds = this.timeLeftSeconds;
        this.$root.$emit("countdownRunning", "true");

        if (this.$interval) {
          clearInterval(this.$interval);
        }

        if (this.$confirmTimeout) {
          clearTimeout(this.$confirmTimeout);
        }
        this.start = false;

        //3 seconds confirmation
        this.$confirmTimeout = setTimeout(
          function () {
            this.start = true;
          }.bind(this),
          3000
        );
        this.$interval = setInterval(
          function () {
            if (this.timeLeftSeconds == 0) {
              console.log("Time out ended.");
              clearInterval(this.$interval);
              this.notify();
            } else if (this.start) {
              this.decrementTimeLeft();
            }
          }.bind(this),
          1000
        );
      },

      decrementTimeLeft: function () {
        this.timeLeftSeconds -= 1;
      },

      stopTimer: function () {
        this.timeLeftSeconds = 0;
        clearInterval(this.$interval);
        this.$root.$emit("countdownRunning", "false");
      },

      notify: function () {
        var lightId = 1;
        this.audio.play();

        axios.get(apiSettings.hueApiURl).then(async (response) => {
          var data = response.data[lightId];
          var isOn = data.state.on;
          var origBri = data.state.bri;
          var origHue = data.state.hue;
          var origSat = data.state.sat;

          for (var i = 0; i < 4; i++) {
            this.setLight(lightId, true, 255, 58670, 254);
            await this.sleep(800);
            this.setLight(lightId, true, 100, 0, 0);
            await this.sleep(800);
          }

          //Restore original values
          console.log("Restore light state");
          this.setLight(lightId, isOn, origBri, origHue, origSat);
          this.$root.$emit("countdownRunning", "false");
        });
      },

      sleep: function (ms) {
        return new Promise((resolve) => setTimeout(resolve, ms));
      },

      setLight: function (lightID, on, bri, hue, sat) {
        var putUrl = apiSettings.hueApiURl + "/" + lightID + "/state";
        this.lightValue = bri;
        var brightness = bri;

        if (hue == undefined || sat == undefined) {
          axios.put(putUrl, { on: on, bri: brightness });
        } else {
          axios.put(putUrl, { on: on, bri: brightness, hue: hue, sat: sat });
        }
        console.log("Set light brigthness to: " + brightness);
      },
    },
  };
</script>
