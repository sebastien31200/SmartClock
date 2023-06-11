const axios = require("axios");

exports.getStopSchedules = function (sockets, stopAreaId) {
  //xset dpms force off
  key = "71c816b8-86e0-464c-b11c-576cc47bafab";
  //stopAreaId = "SA_1631";
  url = `https://api.tisseo.fr/v2/stops_schedules.json?key=${key}&stopAreaId=stop_area:${stopAreaId}`;
  axios.get(url).then((response) => {
    console.log(response["data"]);
    sockets.emit("busStopSchedules", response["data"]);
  });
};
