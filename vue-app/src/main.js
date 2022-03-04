import Vue from "vue";
import App from "./App.vue";
import Vuetify from "vuetify/lib";
import VueSocketIO from "vue-socket.io";
import SocketIO from "socket.io-client";

console.log("Environment: " + process.env.NODE_ENV);
Vue.prototype.$clockTimer = process.env.VUE_APP_TIMER_SEC; //120 seconds to ease debug
Vue.config.productionTip = false;
//Ignore annoying warning
const ignoreWarnMessage =
  "The .native modifier for v-on is only valid on components but it was used on <div>.";
Vue.config.warnHandler = function (msg) {
  // `trace` is the component hierarchy trace
  if (msg === ignoreWarnMessage) {
    msg = null;
  }
};

Vue.use(Vuetify);

var vuetify = new Vuetify({
  theme: { dark: true },
});

var serverUrl =
  process.env.VUE_APP_SERVER_URL + ":" + process.env.VUE_APP_SERVER_PORT;
Vue.use(
  new VueSocketIO({
    debug: false,
    connection: SocketIO(serverUrl, { withCredentials: false }),
  })
);

new Vue({
  vuetify,
  render: (h) => h(App),
}).$mount("#app");
