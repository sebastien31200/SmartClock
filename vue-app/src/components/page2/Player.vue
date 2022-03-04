<template>
  <div>
    <audio id="radio" ref="radio" muted>
      <source
        src="http://icecast.radiofrance.fr/franceinfo-midfi.mp3"
        type="audio/wav"
      />
    </audio>
    <v-card elevation="10" class="ma-2 pa-3 mt-2" width="350">
      <div style="text-align: center;" class="title">{{ title }}</div>
      <div style="text-align: center" class="mb-3">{{ artist }}</div>
      <div style="text-align:center">
        <v-btn class="mr-3 ml-3" fab color="#1DB954" @click="setPlayRadio">
          <v-icon v-if="isRadioPlaying" large color="black"
            >mdi-radio-off</v-icon
          >
          <v-icon v-else large color="black">mdi-radio</v-icon>
        </v-btn>
        <v-btn
          :disabled="!connected"
          fab
          color="#1DB954"
          @click="setNextOrPrev('prev')"
        >
          <v-icon size="40" color="black"
            >mdi-skip-previous-circle-outline</v-icon
          >
        </v-btn>
        <v-btn
          :disabled="!connected"
          class="mr-3 ml-3"
          fab
          color="#1DB954"
          @click="setPlayPause"
        >
          <v-icon v-if="playing" large color="black"
            >mdi-pause-circle-outline</v-icon
          >
          <v-icon v-else large color="black">mdi-play-circle-outline</v-icon>
        </v-btn>
        <v-btn
          :disabled="!connected"
          fab
          color="#1DB954"
          @click="setNextOrPrev('next')"
        >
          <v-icon large color="black">mdi-skip-next-circle-outline</v-icon>
        </v-btn>
      </div>
      <div style="text-align: center">{{ device }}</div>
      <v-slider
        thumb-label
        v-model="volumeValue"
        min="0"
        max="100"
        v-on:end="setVolume(volumeValue)"
        hide-details
        class="ml-3"
        :color="slider.color"
      ></v-slider>
    </v-card>
  </div>
</template>

<script>
export default {
  data: function() {
    return {
      title: "",
      artist: "",
      device: "",
      playing: false,
      connected: false,
      radio: undefined,
      isRadioPlaying: false,
      volumeValue: 100,
      slider: { label: "color", val: 25, color: "#1DB954" }
    };
  },

  mounted: function() {
    this.radio = this.$refs.radio;
    this.radio.volume = this.volumeValue / 100;
    this.$socket.emit("spotifyPlayerRefresh", "start");
  },

  sockets: {
    spotifyInfo(data) {
      //console.log("Spotify infos  from server: " + data);
      this.radio = this.$refs.radio;
      this.radio.volume = this.volumeValue / 100;

      if (!this.isRadioPlaying) {
        this.artist = data.artist;
        this.title = data.title;
        this.connected = true;
        this.playing = data.is_playing;
      }
    }
  },

  methods: {
    setPlayRadio: function() {
      if (!this.isRadioPlaying) {
        this.radio.play();
        this.title = "France Info";
        this.artist = "";
        this.$root.$emit("radioPlaying", "true");
      } else {
        this.radio.pause();
        this.title = "";
        this.$root.$emit("radioPlaying", "false");
      }
      this.isRadioPlaying = !this.isRadioPlaying;
    },

    setPlayPause: function() {
      var command = "play";
      if (this.playing) {
        command = "pause";
      }
      this.$socket.emit("playerCommand", command);
    },

    setNextOrPrev: function(nextOrPrev) {
      this.$socket.emit("playerCommand", nextOrPrev);
    },

    setVolume: function(value) {
      this.radio.volume = value / 100;
    }
  }
};
</script>