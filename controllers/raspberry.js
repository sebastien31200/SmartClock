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
    process.env.VUE_APP_SERVER_PORT +
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

exports.execCommand = execCommand;
