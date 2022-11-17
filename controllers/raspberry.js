var sensor = require("node-dht-sensor");

const { exec } = require("child_process");
var logs = require("../log.js");

exports.setScreenOn = function (on) {
  //xset dpms force off
  let value = "off";
  if (on) {
    value = "on";
  }
  //let command =  "echo " + value + " | sudo tee /sys/class/backlight/rpi_backlight/bl_power";
  let command = "xset dpms force " + value;
  execCommand(command);
};

exports.startBrowser = function () {
  let command =
    "chromium-browser http://localhost:" +
    process.env.SERVER_PORT +
    " --start-fullscreen";
  execCommand(command);
};

exports.openUrl = function (url) {
  let command = "chromium-browser " + url;
  execCommand(command);
};

exports.restart = function () {
  let command = "lxterminal -e /home/pi/SmartClock/scripts/start.sh";
  execCommand(command);
};

exports.reboot = function () {
  let command = "sudo reboot";
  execCommand(command);
};

exports.shutdown = function () {
  let command = "sudo shutdown now";
  execCommand(command);
};

exports.setBrightnessPct = function (valPct) {
  let value = Math.round((valPct * 255) / 100);
  let command =
    "echo " +
    value +
    " | sudo tee /sys/class/backlight/rpi_backlight/brightness";
  execCommand(command);
};

function execCommand(command) {
  logs.timeLog("[Raspberry] command: " + command);
  exec(command, (err, stdout, stderr) => {
    if (err) {
      console.log(err);
      return;
    }

    // the *entire* stdout and stderr (buffered)
    console.log(`${stdout}`);
    console.log(`${stderr}`);
  });
}

function getTemperatureAndHumidity(sockets) {
  logs.timeLog("[Raspberry] Get temperature and humidity");
  sensor.read(22, 14, function (err, temperature, humidity) {
    if (!err) {
      console.log(`temp: ${temperature}°C, humidity: ${humidity}%`);
      temperature = Math.round(temperature * 10) / 10; //Round first decimal
      temperature = temparature - 2.5; //2.5deg over estimate due to raspberry internal heat
      var message = { temperature: temperature, humidity: humidity };
      console.log(message);
      sockets.emit("temperatureMessage", message);
    }
  });
}

exports.execCommand = execCommand;
exports.getTemperatureAndHumidity = getTemperatureAndHumidity;
