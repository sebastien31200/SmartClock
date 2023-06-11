<template>
  <div v-if="success">
    <v-card elevation="10" class="ma-2 pa-2">
      <div class="text-center">
        <v-progress-circular
          class="font-weight-bold display-1"
          :rotate="270"
          :size="120"
          :width="8"
          :value="bikePct"
          :color="color"
        >
          <v-col>
            <v-row>
              <v-icon size="30" :color="color" class="mr-2">mdi-bicycle</v-icon>
              {{ bikes }}
              <br />
            </v-row>
            <v-row>
              <v-icon size="30" :color="color" class="mr-2"
                >mdi-crop-square</v-icon
              >
              {{ capacity - bikes }}
            </v-row>
          </v-col>
        </v-progress-circular>
      </div>
      <div :class="nameClass">{{ name }}</div>
      <v-overlay absolute="true" :value="!valid" opacity="0.8">
        <v-icon size="50" color="orange">mdi-alert-outline</v-icon>
      </v-overlay>
    </v-card>
  </div>
  <div v-else>
    <v-skeleton-loader
      class="ma-3 pa-2 mt-8"
      type="card"
      elevation="10"
      height="200"
      width="160"
    ></v-skeleton-loader>
  </div>
</template>

<script>
  import axios from "axios";
  import { apiSettings } from "./MainPageUtils";

  export default {
    props: ["stationId", "name", "color"],
    data: function () {
      return {
        bikes: 8,
        capacity: 20,
        valid: true,
        success: false,
      };
    },

    computed: {
      bikePct: function () {
        return (this.bikes * 100) / this.capacity;
      },

      nameClass: function () {
        return (
          "text-center mt-2 subtitle-1 font-weight-bold " +
          this.color +
          "--text"
        );
      },
    },

    mounted: function () {
      axios
        .get(
          apiSettings.jcDecauxApiUrl +
            this.stationId +
            "?contract=toulouse&apiKey=" +
            apiSettings.apiKey
        )
        .then((response) => {
          console.log(response);
          var data = response.data;
          this.bikes = data.totalStands.availabilities.bikes;
          this.capacity = data.totalStands.capacity;
          this.valid = data.connected && data.status == "OPEN";
          this.success = true;
        });
    },
  };
</script>
