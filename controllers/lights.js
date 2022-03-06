const axios = require("axios");

const lights = {
  tv: { id: 1, status: false },
  kitchen: { id: 2, status: false },
  floor: { id: 3, status: false },
};

exports.setAllLightsOnOff = function (status) {
  setLightOn(lights.kitchen, status);
  setLightOn(lights.tv, status);
  setLightOn(lights.floor, status);
};

function setLightOn(light, status) {
  light.status = status;
  var putUrl = process.env.HUE_API_URI + "/" + light.id + "/state";
  console.log("Set light " + light.id + " state to: " + status);
  axios.put(putUrl, { on: status });
}

exports.setAllLightsValue = function (bri, hue, sat) {
  var brightness = Math.round((bri * 255) / 100);
  setLightValue(lights.tv, brightness, hue, sat);
  setLightValue(lights.kitchen, brightness, hue, sat);
  setLightValue(lights.floor, brightness, hue, sat);
};

function setLightValue(light, brightness, hue, sat) {
  var putUrl = process.env.HUE_API_URI + "/" + light.id + "/state";
  light.status = true;
  if (hue == undefined || sat == undefined) {
    axios.put(putUrl, { on: true, bri: brightness });
  } else {
    axios.put(putUrl, { on: true, bri: brightness, hue: hue, sat: sat });
  }
  console.log(light.id + " -> Set light brigthness to: " + brightness);
}

exports.setKitchenLightOnly = function () {
  setLightOn(lights.tv, false);
  setLightOn(lights.floor, false);
  setLightOn(lights.kitchen, true);
};
