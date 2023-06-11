<template>
  <v-card
    class="ma-2 pa-2"
    elevation="10"
    width="300"
    height="200"
    @click="refreshSchedule"
    v-if="success"
  >
    <v-list dense class="pa-0">
      <v-list-item-group>
        <v-list-item v-for="(item, i) in items" :key="i">
          <v-list-item-icon class="mr-0 pa-1">
            <v-icon
              v-text="item.icon"
              :color="item.color"
              style="line-height: 1.4em"
            ></v-icon>
          </v-list-item-icon>
          <v-list-item-content class="pa-0">
            <v-list-item
              v-text="item.lane"
              :class="textClass"
              :style="{
                color: item.color,
                fontSize: '1.4em',
                lineHeight: '1.4em',
                fontWeight: 'bold',
              }"
            ></v-list-item>
          </v-list-item-content>
          <v-list-item-content class="pa-0">
            <v-list-item
              v-text="item.schedule"
              :color="item.color"
              :class="textClass"
              :style="{
                color: item.color,
                fontSize: '1.4em',
                lineHeight: '1.4em',
                fontWeight: 'bold',
              }"
            ></v-list-item>
          </v-list-item-content>
        </v-list-item>
      </v-list-item-group>
    </v-list>
  </v-card>
  <div v-else>
    <v-skeleton-loader
      class="mt-3 ml-2"
      type="list-item-three-line"
      width="300"
    ></v-skeleton-loader>
    <v-skeleton-loader
      class="ml-2"
      type="list-item-three-line"
      width="300"
      height="100px"
    ></v-skeleton-loader>
  </div>
</template>

<script>
  import axios from "axios";
  import { apiSettings } from "./MainPageUtils";

  export default {
    props: ["color"],

    data: () => ({
      items: [],
      success: false,
    }),
    computed: {
      bikePct: function () {
        return (this.bikes * 100) / this.capacity;
      },

      titleClass: function () {
        return "text-center text-h6 font-weight-bold " + this.color + "--text";
      },
      textClass: function () {
        return "ml-1 pa-0";
      },
    },
    mounted: function () {
      this.refreshSchedule();
    },
    methods: {
      refreshSchedule() {
        console.log("Refresh bus schedule");
        axios.get(apiSettings.tisseoApiUrl).then((response) => {
          var departures = response.data.departures;
          var departureList = departures.departure;
          for (let i = 0; i < departureList.length; i++) {
            var departure = departureList[i];
            var destination = departure.destination[0]["name"];
            if (
              destination == "Jeanne d'Arc" ||
              destination == "Fonsegrives Entiore"
            ) {
              var dateTime = new Date(departure.dateTime);
              var currentTime = new Date();
              var schedule = this.msToMin(dateTime - currentTime) + " min";
              var lane = departure.line.shortName;
              var color = "rgb" + departure.line.color;
              if (this.items.length < 4) {
                this.items.push({
                  lane: lane,
                  schedule: schedule,
                  color: color,
                  icon: "mdi-bus",
                });
              }
            }
          }
          this.success = true;
        });
      },
      msToMin: function (s) {
        var ms = s % 1000;
        s = (s - ms) / 1000;
        var secs = s % 60;
        s = (s - secs) / 60;
        var mins = s % 60;

        return mins;
      },
    },
  };
</script>
