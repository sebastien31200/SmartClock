<template>
  <v-card id="forecast-weather" elevation="10" class="pl-1 pr-2 mt-1" style="display:inline-block">
    <v-card-text class="subtitle-1 ml-2 pa-1">{{date}}</v-card-text>
    <v-row no-gutters style="display:inline-block">
      <v-list-item>
        <v-list-item-icon>
          <v-img
            :src="require(`@/assets/weather-icons/${weatherIcon}`)"
            max-height="55"
            max-width="55"
          ></v-img>
        </v-list-item-icon>
        <v-list-item-icon class="ma-0 title">
          <v-icon size="25">mdi-thermometer</v-icon>
          {{temperatureMin}}
        </v-list-item-icon>
        <v-list-item-icon class="ma-0 title">
          <v-icon size="25">mdi-thermometer</v-icon>
          {{temperatureMax}}
        </v-list-item-icon>
      </v-list-item>
      <v-list-item class="pa-0" style="min-height:0px">
        <v-list-item-icon class="mr-1 title" style="color:var(--wind-color);">
          <v-icon size="18" class="mr-2" style="color:var(--wind-color);">mdi-weather-windy</v-icon>
          {{windSpeed}}
        </v-list-item-icon>
        <v-list-item-icon class="title" style="color:var(--prec-color);">
          <v-icon size="18" class="mr-2" style="color:var(--prec-color);">mdi-weather-rainy</v-icon>
          {{precipitationVolume}}
        </v-list-item-icon>
      </v-list-item>
    </v-row>
  </v-card>
</template>

<script>
export default {
  props: {
    weatherIcon: { type: String, required: true },
    date: { type: String, required: true },
    tempMin: { type: Number, required: true },
    tempMax: { type: Number, required: true },
    windSpd: { type: Number, required: true },
    precMm: { type: Number, required: true }
  },

  computed: {
    temperatureMin: function() {
      return this.tempMin + " °";
    },
    temperatureMax: function() {
      return this.tempMax + " °";
    },
    windSpeed: function() {
      return this.windSpd + " km/h";
    },
    precipitationVolume: function() {
      return this.precMm + " mm";
    }
  }
};
</script>

<style>
.v-list-item__icon {
  margin: 0px;
}
</style>


