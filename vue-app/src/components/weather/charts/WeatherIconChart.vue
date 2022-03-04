<template>
  <div id="weather-icon-chart" style="min-height:50px;transform:translateY(-170px)">
    <v-row no-gutters>
      <v-col v-for="(weatherIcon,i) in weatherIconArray.slice(0,5)" v-bind:key="weatherIcon">
        <v-img
          max-height="50"
          max-width="50"
          :src="require(`@/assets/weather-icons/${weatherIcon}`)"
          :style="{left: 70 - 10*i + 'px'}"
        ></v-img>
      </v-col>
    </v-row>
  </div>
</template>

<script>
export default {
  props: {
    weatherIconArray: { type: Array, required: true }
  }
};
</script>

