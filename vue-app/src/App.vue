<template>
  <div id="app">
    <v-app id="inspire" @click.native="switchPage()">
      <v-overlay v-if="showPage2" :opacity="1" color="#262626">
        <Page2></Page2>
      </v-overlay>
      <v-overlay v-if="showWeather" :opacity="1" color="#262626">
        <Weather ref="weather"></Weather>
      </v-overlay>
      <v-overlay
        v-if="showClock"
        :opacity="1"
        @click.native="showClock = false"
      >
        <Clock v-on:showCitationMessage="showCitationMessage()"></Clock>
      </v-overlay>
      <v-overlay v-if="showCitation" :opacity="1">
        <Citation></Citation>
      </v-overlay>
      <v-overlay
        v-if="showAlert"
        absolute="true"
        style="align-items:start"
        :opacity="0"
      >
        <v-alert :type="alertType" class="mt-2">
          {{ alertText }}
        </v-alert>
      </v-overlay>
    </v-app>
  </div>
</template>

<script>
import Weather from "./components/weather/Weather";
import Page2 from "./components/page2/Page2";
import Citation from "./components/Citation";
import Clock from "./components/Clock";

export default {
  components: { Weather, Page2, Citation, Clock },
  data() {
    return {
      isConnected: false,
      message: "Hello",
      showCitation: false,
      showClock: true,
      showPage2: false,
      showAlert: false,
      item: 0,
      newTab: "",
      timeoutHandle: null,
      blockAutoRestore: false,
      alertText: "dd",
      alertType: "info"
    };
  },

  mounted() {
    this.$root.$on("countdownRunning", arg1 => {
      this.blockAutoRestore = arg1 == "true" ? true : false;
      if (arg1 == "false") {
        this.startClockTimer();
      } //Restore clock if countdown is over
    });
    this.$root.$on("radioPlaying", arg1 => {
      this.blockAutoRestore = arg1 == "true" ? true : false;
      if (arg1 == "false") {
        this.startClockTimer();
      } //Restore clock if radio is no longer playing
    });
  },

  sockets: {
    connect() {
      // Fired when the socket connects.
      this.isConnected = true;
    },

    disconnect() {
      this.isConnected = false;
    },

    connectionMessage(data) {
      console.log("[SocketIO] Connected to server: " + data);
      this.startAlertTimer("Connected to server", "info");
    },

    usbConnectionMessage() {
      console.log("[SocketIO] Garmin connected");
      this.startAlertTimer("Garmin connected", "info");
    },

    activityUploadMessage() {
      console.log("[SocketIO] Activity uploaded");
      this.startAlertTimer(
        "Garmin latest activity successfully uploaded",
        "success"
      );
    }
  },

  methods: {
    showCitationMessage() {
      this.showCitation = true;
      this.blockAutoRestore = true;
    },
    startAlertTimer(text, type) {
      this.showAlert = true;
      this.alertText = text;
      this.alertType = type;
      setTimeout(() => {
        this.showAlert = false;
      }, 7000);
    },
    switchPage() {
      if (this.showCitation) {
        this.blockAutoRestore = false;
        this.showCitation = false;
      }
      this.showClock = false;
      this.showWeather = this.showPage2;
      this.showPage2 = !this.showPage2;
      this.startClockTimer();
    },
    startClockTimer() {
      if (this.timeoutHandle) {
        clearTimeout(this.timeoutHandle);
      }
      this.timeoutHandle = setTimeout(
        function() {
          if (!this.blockAutoRestore) {
            this.showClock = true;
            this.showPage2 = false;
            this.showWeather = false;
            this.showCitation = false;
          }
        }.bind(this),
        this.$clockTimer * 1000 //ms
      );
    }
  }
};
</script>

<style>
.v-carousel__controls .v-icon {
  font-size: 36px !important;
}

#btnClose {
  height: 40px;
  min-width: 40px;
}
</style>