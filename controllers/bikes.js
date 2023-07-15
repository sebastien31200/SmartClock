const axios = require("axios");

jcDecauxApiUrl = "https://api.jcdecaux.com/vls/v3/stations";

exports.getAvailability = function (sockets, stationId) {
  apiKey = process.env.JCDECAUX_API_KEY;
  console.log(apiKey);
  url = `${jcDecauxApiUrl}/${stationId}/?contract=toulouse&apiKey=${apiKey}`;
  axios.get(url).then((response) => {
    sockets.emit("bikesAvailability", response["data"]);
  });
};
