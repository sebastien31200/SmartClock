<template>
  <v-card elevation="10" class="ma-1 purple--text text--lighten-3" width="150">
    <v-row no-gutters>
      <v-icon large class="ml-2 purple--text text--lighten-3"
        >mdi-string-lights</v-icon
      >
      <v-switch
        @click.stop=""
        @click="setHeater"
        color="purple lighten-3"
        v-model="switch1"
        class="ml-5"
      ></v-switch>
    </v-row>
  </v-card>
</template>

<script>
export default {
  data() {
    return {
      switch1: false
    };
  },

  mounted: function() {
    this.$socket.emit("getHeaterStatus", this.switch1);
  },

  sockets: {
    relayStatusMessage(data) {
      this.switch1 = data.status == 0 ? false : true;
    }
  },

  methods: {
    setHeater: function() {
      console.log("Send heater command: " + this.switch1);
      this.$socket.emit("heaterCommand", this.switch1);
    }
  }
};
</script>