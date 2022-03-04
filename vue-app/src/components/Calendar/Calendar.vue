<template>
  <v-row class="fill-height">
    <v-col>
      <v-sheet dark>
        <v-toolbar flat>
          <v-btn outlined class="mr-4" @click="setToday">Aujourd'hui</v-btn>
          <v-btn fab text medium @click="prev">
            <v-icon medium>mdi-chevron-left</v-icon>
          </v-btn>
          <v-toolbar-title width="220">{{ title }}</v-toolbar-title>
          <v-btn fab text medium @click="next">
            <v-icon medium>mdi-chevron-right</v-icon>
          </v-btn>
          <v-spacer></v-spacer>
          <v-btn outlined class="mr-4" @click="type = 'month'">Mois</v-btn>
          <v-btn outlined class="mr-4" @click="type = 'week'">Semaine</v-btn>
          <v-btn outlined class="mr-4" @click="type = 'day'">Jour</v-btn>
        </v-toolbar>
      </v-sheet>
      <v-sheet height="400">
        <v-calendar
          ref="calendar"
          v-model="focus"
          color="primary"
          :events="events"
          :event-color="getEventColor"
          :now="today"
          :type="type"
          :weekdays="[1, 2, 3, 4, 5, 6, 0]"
          @click:event="showEvent"
          @click:more="viewDay"
          @click:date="viewDay"
          @change="updateRange"
        ></v-calendar>
        <v-menu
          v-model="selectedOpen"
          :close-on-content-click="false"
          :activator="selectedElement"
          offset-x
        >
          <v-card color="grey lighten-4" max-width="350px" flat>
            <v-toolbar :color="selectedEvent.color" dark>
              <v-toolbar-title v-html="selectedEvent.name"></v-toolbar-title>
              <v-spacer></v-spacer>
            </v-toolbar>
            <v-card-text class="black--text" v-html="eventStartEndString"></v-card-text>
            <v-card-text class="black--text" v-if="selectedEvent.details != undefined">
              <span style="height:100px" v-html="selectedEvent.details.slice(0,300)"></span>
            </v-card-text>
            <v-card-text class="black--text" v-if="selectedEvent.location != undefined">
              <v-icon :color="selectedEvent.color">mdi-map-marker</v-icon>
              <span v-html="selectedEvent.location"></span>
            </v-card-text>
            <v-card-actions>
              <v-btn text color="secondary" @click="selectedOpen = false">Fermer</v-btn>
            </v-card-actions>
          </v-card>
        </v-menu>
      </v-sheet>
    </v-col>
  </v-row>
</template>

<script>
import axios from "axios";
import { getDayOfWeek } from "../weather/WeatherUtils";
import { getMonth } from "../weather/WeatherUtils";
import moment from "moment";

if (process.env.NODE_ENV == "development") {
  var axiosInstance = axios.create({ baseURL: "http://100.115.92.206:3000" });
} else {
  axiosInstance = axios;
}

export default {
  data: () => ({
    focus: "",
    type: "month",
    typeToLabel: {
      month: "Mois",
      week: "Semaine",
      day: "Jour",
      "4day": "4 jours"
    },
    today: null,
    start: null,
    end: null,
    selectedEvent: {},
    selectedElement: null,
    selectedOpen: false,
    events: []
  }),
  computed: {
    title() {
      const { start, end } = this;
      if (!start || !end) {
        return "";
      }
      const startMonth = this.monthFormatter(start);
      const endMonth = this.monthFormatter(end);
      const prefixMonth = startMonth === endMonth ? "" : startMonth;

      const startYear = start.year;
      const endYear = end.year;
      const prexixYear = startYear === endYear ? "" : startYear;

      const startDay = start.day;
      const endDay = end.day;

      switch (this.type) {
        case "month":
          return `${startMonth} ${startYear}`;
        case "week":
          return `${startDay} ${prefixMonth} ${prexixYear} - ${endDay} ${endMonth} ${endYear}`;
        case "4day":
          return `${startDay} ${prefixMonth} ${prexixYear} - ${endDay} ${endMonth} ${endYear}`;
        case "day":
          return `${startMonth} ${startDay} ${startYear}`;
      }
      return "";
    },
    eventStartEndString() {
      var start = new Date(this.selectedEvent.start);
      var end = new Date(this.selectedEvent.end);

      var startDayOfWeek = getDayOfWeek(start);
      var startDate = start.getDate();
      var startMonth = getMonth(start.getMonth());
      var startTime = moment(start).format("HH:mm");
      var endTime = moment(end).format("HH:mm");
      console.log(`${startDayOfWeek} ${startDate} ${startMonth}`);

      if (
        start.getDate() == end.getDate() &&
        start.getMonth() == end.getMonth()
      ) {
        return `${startDayOfWeek} ${startDate} ${startMonth} &#8226; ${startTime} - ${endTime} `;
      } else {
        var endDayOfWeek = getDayOfWeek(end);
        var endDate = end.getDate();
        var endMonth = getMonth(end.getMonth());
        return `${startDayOfWeek} ${startDate} ${startMonth} à ${startTime} - ${endDayOfWeek} ${endDate} ${endMonth} à ${endTime} `;
      }
    },
    dayFormatter() {
      return this.$refs.calendar.getFormatter({
        timeZone: "UTC",
        weekday: "long"
      });
    },
    monthFormatter() {
      return this.$refs.calendar.getFormatter({
        timeZone: "UTC",
        month: "long"
      });
    },
    mounted() {
      return this.$refs.calendar.checkChange();
    }
  },
  methods: {
    viewDay({ date }) {
      this.focus = date;
      this.type = "day";
    },
    getEventColor(event) {
      return event.color;
    },
    setToday() {
      this.focus = this.today;
    },
    prev() {
      this.$refs.calendar.prev();
    },
    next() {
      this.$refs.calendar.next();
    },
    showEvent({ nativeEvent, event }) {
      const open = () => {
        this.selectedEvent = event;
        this.selectedElement = nativeEvent.target;
        setTimeout(() => (this.selectedOpen = true), 10);
      };

      if (this.selectedOpen) {
        this.selectedOpen = false;
        setTimeout(open, 10);
      } else {
        open();
      }

      nativeEvent.stopPropagation();
    },
    updateRange({ start, end }) {
      const events = [];
      console.log("Changed!");

      axiosInstance.get("/events").then(response => {
        var calendarEvents = response.data;
        for (let i = 0; i < calendarEvents.length; i++) {
          var allDay = false;
          events.push({
            name: calendarEvents[i].summary,
            details: calendarEvents[i].description,
            location: calendarEvents[i].location,
            start: this.formatDate(
              new Date(calendarEvents[i].startTime),
              !allDay
            ),
            end: this.formatDate(new Date(calendarEvents[i].endTime), !allDay),
            color: calendarEvents[i].color
          });
        }
        console.log(events[0]);
        this.events = events;
      });

      this.start = start;
      this.end = end;
    },
    formatDate(date, withTime) {
      return withTime
        ? `${date.getFullYear()}-${date.getMonth() +
            1}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}`
        : `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
    }
  }
};
</script>