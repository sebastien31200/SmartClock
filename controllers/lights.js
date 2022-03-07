const axios = require("axios");
var logs = require("../log.js");

const lights = {
  tv: { id: 1 },
  kitchen: { id: 2 },
  floor: { id: 3 },
};

var getAllLightsStatus = (exports.getAllLightsStatus = function (sockets) {
  var getUrl = process.env.HUE_API_URI + "/";
  logs.timeLog("[Lights] Get lights status");
  axios
    .get(getUrl)
    .then((response) => {
      lightStatus = {
        tv: {
          on: response.data[lights.tv.id].state.on,
          bri: response.data[lights.tv.id].state.bri,
        },
        kitchen: {
          on: response.data[lights.kitchen.id].state.on,
          bri: response.data[lights.kitchen.id].state.bri,
        },
        floor: {
          on: response.data[lights.floor.id].state.on,
          bri: response.data[lights.floor.id].state.bri,
        },
      };
      console.log(lightStatus);
      sockets.emit("lightStatus", lightStatus);
    })
    .catch((error) => {
      console.log(error);
    });
});

exports.setAllLightsStatus = function (data, sockets) {
  on = data["on"];

  var bri = undefined,
    hue = undefined,
    sat = undefined;
  if (data.hasOwnProperty("bri")) {
    bri = data["bri"];
  }
  if (data.hasOwnProperty("hue")) {
    hue = data["hue"];
  }
  if (data.hasOwnProperty("sat")) {
    sat = data["sat"];
  }

  setLightStatus(lights.tv, on, bri, hue, sat);
  setLightStatus(lights.kitchen, on, bri, hue, sat);
  setLightStatus(lights.floor, on, bri, hue, sat);

  if (sockets) {
    getAllLightsStatus(sockets);
  }
};

exports.setKitchenLightOnly = function (data, sockets) {
  setLightStatus(lights.tv, false);
  setLightStatus(lights.floor, false);
  setLightStatus(lights.kitchen, data.on);
  if (sockets) {
    getAllLightsStatus(sockets);
  }
};

function setLightOn(light, status) {
  light.status = status;
  var putUrl = process.env.HUE_API_URI + "/" + light.id + "/state";
  console.log("Set light " + light.id + " state to: " + status);
  axios.put(putUrl, { on: status });
}

function setLightStatus(light, on, bri, hue, sat) {
  var putUrl = process.env.HUE_API_URI + "/" + light.id + "/state";
  light.status = true;
  json = {};
  if (on != undefined) {
    json["on"] = on;
  }
  if (bri != undefined) {
    json["bri"] = bri;
  }
  if (hue != undefined) {
    json["hue"] = hue;
  }
  if (sat != undefined) {
    json["sat"] = sat;
  }
  axios.put(putUrl, json).catch((error) => {
    console.log(error);
  });

  logs.timeLog("[Lights] " + light.id + " PUT");
  console.log(json);
}
