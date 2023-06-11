<template>
  <div id="current-weather" class="ml-5 mt-3">
    <v-row>
      <v-img
        class="ml-5"
        max-width="80"
        max-height="80"
        :src="require(`@/assets/weather-icons/${weatherIcon}`)"
      ></v-img>
      <div class="display-3 ml-10 mt-2" style="color:var(--temp-color);">{{temperature}}</div>
      <div class="display-2 ml-2 mt-2" style="color:var(--temp-color);">°</div>
      <div class="display-3 ml-5 mt-2" style="color:var(--wind-color);">{{windSpeed}}</div>
      <div class="display-2 ml-2 mt-4" style="color:var(--wind-color);">km/h</div>
    </v-row>
    <!--v-row-- style="margin: 20px 10px 0 10px">
      <v-icon size="35" color="yellow darken-2">mdi-weather-sunset-up</v-icon>
      <div style="padding:5px;" class="display-1 yellow--text text--darken-2">{{sunrise}}</div>
      <v-icon size="35" color="orange darken-3" style="margin-left:40px">mdi-weather-sunset-down</v-icon>
      <div style="padding:5px" class="display-1 orange--text text--darken-3">{{sunset}}</div>
    </!--v-row-->
  </div>
</template>

<script>
export default {
  props: { temperature: Number, windSpeed: Number, weatherIcon: String }
};
</script>