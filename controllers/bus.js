const axios = require("axios");

tisseoApiUrl = "https://api.tisseo.fr/v2";

exports.getStopSchedules = function (sockets, stopAreaId) {
  apiKey = process.env.TISSEO_API_KEY;
  url = `${tisseoApiUrl}/stops_schedules.json?key=${apiKey}&stopAreaId=stop_area:${stopAreaId}`;
  axios.get(url).then((response) => {
    sockets.emit("busStopSchedules", response["data"]);
  });
};
