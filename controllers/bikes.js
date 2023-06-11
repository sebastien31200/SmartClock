const axios = require("axios");

jcDecauxApiUrl = "https://api.jcdecaux.com/vls/v3/stations";

exports.getAvailability = function (sockets, stationId) {
  apiKey = "23c3130ef1e50f8d77883313d038bbe163080587";
  url = `${jcDecauxApiUrl}/${stationId}/?contract=toulouse&apiKey=${apiKey}`;
  axios.get(url).then((response) => {
    sockets.emit("bikesAvailability", response["data"]);
  });
};
