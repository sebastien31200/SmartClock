const app = require("express")();
const server = require("http").Server(app);
const logs = require("./log.js");
const schedule = require("node-schedule");
const bodyParser = require("body-parser");
const argv = require("minimist")(process.argv.slice(2));
const io = require("socket.io")(server, {
  allowEIO3: true, // false by default
  cors: {
    origin: "*",
  },
});

require("dotenv").config({ path: `vue-app/.env.${process.env.NODE_ENV}` });
argumentsArray = argv._; //nohmi argument

logs.timeLog("STARTING RASPBERRY SERVER");
logs.timeLog("Args: " + argumentsArray);
logs.timeLog("Environment: " + process.env.NODE_ENV);

app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

/* Serve html page in dist directory*/
var serveStatic = require("serve-static");
app.use(serveStatic(__dirname + "/vue-app/dist"));

/* Controllers */
var spotify = require("./controllers/spotify.js");
var raspberry = require("./controllers/raspberry.js");
var garmin = require("./controllers/garmin.js");
var lights = require("./controllers/lights.js");
var bus = require("./controllers/bus.js");
var bikes = require("./controllers/bikes.js");

app.get("/", (req, res) => {
  res.setHeader("Content-Type", "text/html");
  res.send("<h1> Welcome to SmartClock Web Server <h1> ");
});

//Spotify management
app.get("/spotify/token", spotify.token);
app.get("/spotify/infos", spotify.infos);
app.get("/spotify/player", spotify.player);

//Raspberry management
app.get("/reboot", raspberry.reboot);
app.get("/shutdown", raspberry.shutdown);
app.get("/restart", raspberry.restart);

//Create credential file if needed
spotify.initSpotifyCredential();

io.on("connection", function (socket) {
  logs.timeLog("Client connected");
  socket.emit("connectionMessage", "Hello from server");

  var refreshTempDelay = 300; //seconds
  var refreshInterval = setInterval(() => {
    json = raspberry.getTemperatureAndHumidity(io.sockets);
  }, 1000 * refreshTempDelay);

  socket.on("disconnect", function () {
    logs.timeLog("Client disconnected");
    clearInterval(refreshInterval);
  });

  //Get light status request from client
  socket.on("getAllLights", function (data) {
    logs.timeLog("Receive getAllLights message");
    lights.getAllLightsStatus(io.sockets);
  });

  //Get light status request from client
  socket.on("setAllLights", function (data) {
    logs.timeLog("Receive setAllLights message");
    console.log(data);
    lights.setAllLightsStatus(data, io.sockets);
  });

  //Get light status request from client
  socket.on("setKitchenLight", function (data) {
    logs.timeLog("Receive setKitchenLight message");
    console.log(data);
    lights.setKitchenLightOnly(data, io.sockets);
  });

  //Start garmin service
  //garmin.startMonitoring(io.sockets);

  //Temperature request from client
  socket.on("getTemperature", function (data) {
    logs.timeLog("Receive getTemperature message");
    raspberry.getTemperatureAndHumidity(io.sockets);
  });

  socket.on("playerCommand", function (command) {
    logs.timeLog(`Player command: ${command}`);
    spotify.player(io.sockets, data);
  });

  socket.on("getBusStopSchedules", function (stopId) {
    logs.timeLog(`Get bus schedules for stop id: ${stopId}`);
    bus.getStopSchedules(io.sockets, stopId);
  });

  socket.on("getBikesAvailability", function (stationId) {
    logs.timeLog(`Get bikes availability for station: ${stationId}`);
    bikes.getAvailability(io.sockets, stationId);
  });

  var spotifyPlayerRefreshTimer = null;
  socket.on("spotifyPlayerRefresh", function (data) {
    if (data == "start") {
      if (spotifyPlayerRefreshTimer == null) {
        logs.timeLog("[Start refresh Player info]");
        spotifyPlayerRefreshTimer = setInterval(() => {
          //console.log("refresh");
          spotify.infos(io.sockets);
        }, 2000);
      }
    } else {
      logs.timeLog("[Stop refresh Player info]");
      clearInterval(spotifyPlayerRefreshTimer);
      spotifyPlayerRefreshTimer = null;
    }
  });
});

server.listen(process.env.SERVER_PORT, () => {
  const port = server.address().port;
  logs.timeLog(`App listening on port ${port}`);
});

/* Launch Chromium browser*/
if (process.env.NODE_ENV != "development") {
  logs.timeLog("Starting Chromium browser");
  nohmi = argumentsArray.includes("nohmi"); //no hmi mode
  if (!nohmi) {
    raspberry.startBrowser();
    raspberry.setScreenOn(1);
  }
}

if (process.env.NODE_ENV != "development") {
  let date = new Date();
  if (date.getHours() > 19) {
    logs.timeLog("Init brigthness to 12%");
    raspberry.setBrightnessPct(12);
  } else {
    logs.timeLog("Init brigthness to 20%");
    raspberry.setBrightnessPct(20);
  }
}

/* Schedulers */

/*Switch on screen at 7h00*/
schedule.scheduleJob("00 7 * * *", function () {
  raspberry.setScreenOn(1);
  raspberry.setBrightnessPct(10);
});

/* Increase brightness at 12h*/
schedule.scheduleJob("00 12 * * *", function () {
  raspberry.setBrightnessPct(18);
});

/*Switch off screen at 23h00*/
schedule.scheduleJob("00 23 * * *", function () {
  raspberry.setScreenOn(0);
});
