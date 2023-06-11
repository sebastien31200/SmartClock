const axios = require("axios");

tisseoApiUrl = "https://api.tisseo.fr/v2";

exports.getStopSchedules = function (sockets, stopAreaId) {
  apiKey = "71c816b8-86e0-464c-b11c-576cc47bafab";
  url = `${tisseoApiUrl}/stops_schedules.json?key=${apiKey}&stopAreaId=stop_area:${stopAreaId}`;
  axios.get(url).then((response) => {
    sockets.emit("busStopSchedules", response["data"]);
  });
};
