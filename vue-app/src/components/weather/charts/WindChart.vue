<template>
  <div id="wind-chart" style="width:800px;transform:translate(-30px, 25px)">
    <v-row no-gutters>
      <v-col v-for="(windSpd, index) in windSpeedSeries" v-bind:key="windSpd" style="margin:auto">
        <WindIcon :speed="windSpd" :direction="windDirSeries[index]" :iconIndex="index"></WindIcon>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import WindIcon from "./WindIcon";
export default {
  components: { WindIcon },
  props: {
    windSpeedSeries: { type: Array, required: true },
    windDirSeries: { type: Array, required: true }
  }
};
</script>

<style>
</style>