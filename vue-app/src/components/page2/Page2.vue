<template>
  <div class="mt-5">
    <!--Recipe-- ref="recipe"></!--Recipe-->
    <v-row no-gutters>
      <v-col class="colClass" @click.stop="">
        <Light class="centerClass"></Light>
        <Player class="centerClass"></Player>
        <HeaterSwitch class="centerClass"></HeaterSwitch>
        <Countdown class="centerClass"></Countdown>
      </v-col>
      <v-col class="colClass">
        <AllStations></AllStations>
        <Bus color="cyan"></Bus>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import AllStations from "./AllStations";
import Light from "./Light";
import Player from "./Player";
import Bus from "./Bus";
import HeaterSwitch from "./HeaterSwitch";
import Countdown from "./Countdown";

export default {
  components: { AllStations, Light, Player, Bus, HeaterSwitch, Countdown }
};
</script>

<style scoped>
.colClass {
  width: 100%;
  text-align: center;
}
.centerClass {
  display: inline-block;
  margin: 0 auto;
}
</style>