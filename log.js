var fs = require("fs");
var util = require("util");
//var log_file = fs.createWriteStream(__dirname + "/server.log", { flags: "w" });
var log_file = fs.createWriteStream("/tmp/server.log", { flags: "w" });
var log_stdout = process.stdout;

exports.timeLog = function (logMessage) {
  let options = {
      timeZone: "Europe/Paris",
      year: "numeric",
      day: "numeric",
      month: "numeric",
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
    },
    formatter = new Intl.DateTimeFormat("fr-FR", options);

  var date = formatter.format(new Date());
  var timeMessage = date + " - " + logMessage;
  log_file.write(util.format(timeMessage) + "\n");
  log_stdout.write(util.format(timeMessage) + "\n");
};
