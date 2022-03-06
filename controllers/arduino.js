const http = require("http");
//var sheetApi = require("./sheet.js");
var request = require("requestretry");
var logs = require("../log.js");

exports.getTemperatureAndHumidity = function (sockets) {
  var reqUrl = process.env.ARDUINO_URI + "/temperature";
  logs.timeLog("[Arduino] Get temperature: " + reqUrl);
  request(
    {
      url: reqUrl,
      json: true,
      maxAttempts: 3, // (default) try 5 times
      retryDelay: 2000, // (default) wait for 5s before trying again
      retrySrategy: request.RetryStrategies.HTTPOrNetworkError, // (default) retry on 5xx or network errors
    },
    function (err, resp, body) {
      if (err) {
        logs.timeLog(err);
      } else {
        logs.timeLog(
          "[Arduino] getTemperatureAndHumidity response: " +
            resp.body.temperature
        );
        var dateStr = new Date().toLocaleString();
        var temperature = resp.body.temperature;
        var humidity = resp.body.humidity;
        //sheetApi.addNewSheetRow([[dateStr, temperature, humidity]])
        sockets.emit("temperatureMessage", resp.body);
      }
    }
  );
};

exports.getRelayStatus = function (sockets) {
  var reqUrl = process.env.ARDUINO_URI + "/status";
  logs.timeLog("[Arduino] Get Relay: " + reqUrl);
  request(
    {
      url: reqUrl,
      json: true,
      maxAttempts: 3, // (default) try 5 times
      retryDelay: 2000, // (default) wait for 5s before trying again
      retrySrategy: request.RetryStrategies.HTTPOrNetworkError, // (default) retry on 5xx or network errors
    },
    function (err, resp, body) {
      if (err) {
        logs.timeLog(err);
      } else {
        logs.timeLog("[Arduino] getRelayStatus response: " + resp.body.status);
        sockets.emit("relayStatusMessage", resp.body);
      }
    }
  );
};

exports.setRelay = function (data) {
  var reqUrl = process.env.ARDUINO_URI + "/?activate=" + data;
  logs.timeLog("[Arduino] Activate heater: " + reqUrl);
  request(
    {
      url: reqUrl,
      json: true,
      maxAttempts: 3, // (default) try 5 times
      retryDelay: 2000, // (default) wait for 5s before trying again
      retrySrategy: request.RetryStrategies.HTTPOrNetworkError, // (default) retry on 5xx or network errors
    },
    function (err, resp, body) {
      if (err) {
        logs.timeLog(err);
      } else {
        logs.timeLog("[Arduino] setRelay response: " + resp.body.activate);
      }
    }
  );
};
