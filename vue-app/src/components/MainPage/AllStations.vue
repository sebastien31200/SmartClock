<template>
  <v-div>
    <v-col>
      <v-row>
        <div v-for="station in stations" v-bind:key="station.id">
          <Station :stationId="station.id" :name="station.name" :color="station.color"></Station>
        </div>
      </v-row>
    </v-col>
  </v-div>
</template>

<script>
import Station from "./Station";

export default {
  components: { Station },

  data: function() {
    return {
      stations: [
        { id: "240", name: "Place Job", color: "teal" },
        { id: "219", name: "Puccini", color: "teal" }
      ]
    };
  }
};
</script>