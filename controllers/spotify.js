const fs = require("fs");
var logs = require("../log.js");

var SpotifyWebApi = require("spotify-web-api-node");
const cookieParser = require("cookie-parser");

const SPOTIFY_TOKEN_PATH = "./controllers/config/tokenSpotify.json";

exports.token = function (req, res) {
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:8080");
  res.setHeader("Access-Control-Allow-Credentials", true);

  var redirectUri = req.protocol + "://" + req.get("host") + "/spotify/token";
  logs.timeLog("GetToken: redirectURi=" + redirectUri);

  var credentials = {
    clientId: clientId,
    clientSecret: clientSecret,
    redirectUri: redirectUri,
  };

  var spotifyApi = new SpotifyWebApi(credentials);

  let code = req.query.code;
  logs.timeLog("[Spotify] Authorization code: " + code);

  // The code that's returned as a query parameter to the redirect URI
  // Retrieve an access token and a refresh token
  spotifyApi.authorizationCodeGrant(code).then(
    function (data) {
      var access_token = data.body["access_token"];
      var refresh_token = data.body["refresh_token"];
      var token_expires_in = data.body["expires_in"];

      //Compute expiration date
      var now = new Date();
      var expDate = now.setSeconds(now.getSeconds() + token_expires_in);

      logs.timeLog("The access token is: " + access_token);
      logs.timeLog("The refresh token is: " + refresh_token);
      logs.timeLog("The token expires on: " + new Date(expDate));

      // Set the access token on the API object to use it in later calls
      spotifyApi.setAccessToken(access_token);
      spotifyApi.setRefreshToken(refresh_token);

      //Store token data in tokenSpotify.json
      var token = {
        access_token: access_token,
        token_expire_date: expDate,
        refresh_token: refresh_token,
      };

      fs.writeFile(SPOTIFY_TOKEN_PATH, JSON.stringify(token), (err) => {
        if (err) console.error(err);
        console.log("Spotify token stored to file: ", SPOTIFY_TOKEN_PATH);
      });

      res.redirect("/?spotify_token=ok");
    },
    function (err) {
      console.error("Something went wrong!", err);
      res.redirect("/?spotify_token=ko");
    }
  );
};

exports.infos = function (sockets) {
  performSpotifyOperation(sockets, (spotifyApi, sockets) => {
    spotifyApi.getMyCurrentPlaybackState().then(
      function (data) {
        if (data.body.device != undefined) {
          info = {
            playback: data.body.device.name,
            volume: data.body.device.volume_percent,
            artist: data.body.item.album.artists[0].name,
            title: data.body.item.name,
            is_playing: data.body.is_playing,
          };
          sockets.emit("spotifyInfo", info);
        }
      },
      function (err) {
        console.error("[Spotify] Something went wrong!", err);
      }
    );
  });
};

exports.player = function (sockets, command) {
  //var command = req.query.command;
  //logs.timeLog("GET /spotify/player command:" + command);
  logs.timeLog("[Spotify] Spotify command: " + command);

  switch (command) {
    case "play":
      performSpotifyOperation(sockets, (spotifyApi, sockets) => {
        spotifyApi.play().then(
          function (data) {
            logs.timeLog("[Spotify] Play OK");
          },
          function (err) {
            logs.timeLog("[Spotify] Play error !");
            console.log(err);
          }
        );
      });
      break;
    case "pause":
      performSpotifyOperation(sockets, (spotifyApi, sockets) => {
        spotifyApi.pause().then(
          function (data) {
            logs.timeLog("[Spotify] Pause OK");
          },
          function (err) {
            logs.timeLog("[Spotify] Pause error !");
            console.log(err);
          }
        );
      });
      break;
    case "next":
      performSpotifyOperation(sockets, (spotifyApi, sockets) => {
        spotifyApi.skipToNext().then(
          function (data) {
            logs.timeLog("[Spotify] Next OK");
          },
          function (err) {
            logs.timeLog("[Spotify] Next error !", err);
            console.log(err);
          }
        );
      });
      break;
    case "prev":
      performSpotifyOperation(sockets, (spotifyApi, sockets) => {
        spotifyApi.skipToPrevious().then(
          function (data) {
            logs.timeLog("[Spotify] Previous OK");
          },
          function (err) {
            logs.timeLog("[Spotify] Previous error !");
            console.log(err);
          }
        );
      });
    case "volume":
      performSpotifyOperation(sockets, (spotifyApi, sockets) => {
        spotifyApi.setVolume(50).then(
          function (data) {
            logs.timeLog("[Spotify] Set volume OK");
          },
          function (err) {
            logs.timeLog("[Spotify] Set volume KO !");
            console.log(err);
          }
        );
      });
  }
};

exports.initSpotifyCredential = function () {
  fs.readFile(SPOTIFY_TOKEN_PATH, (err, content) => {
    if (err) {
      logs.timeLog(
        "[Spotify] Error while reading " +
          SPOTIFY_TOKEN_PATH +
          " -> initializing credentials"
      );
      getSpotifyCode();
    }
  });
};

function getSpotifyCode() {
  var scopes = [
    "user-read-private",
    "user-read-email",
    "user-read-playback-state",
    "user-modify-playback-state",
    "user-read-currently-playing",
  ];

  if (process.env.ENV == "DEV") {
    var baseUri = "http://100.115.92.204:" + process.env.PORT;
  } else {
    var baseUri = "http://176.158.11.35:" + +process.env.PORT;
  }

  var redirectUri = baseUri + "/spotify/token";
  logs.timeLog("Redirect URI: " + redirectUri);

  // Setting credentials can be done in the wrapper's constructor, or using the API object's setters.
  var spotifyApi = new SpotifyWebApi({
    redirectUri: redirectUri,
    clientId: clientId,
    clientSecret: clientSecret,
  });

  // Create the authorization URL
  var authorizeURL = spotifyApi.createAuthorizeURL(scopes);
  logs.timeLog("Visit the URL: " + authorizeURL);
}

function performSpotifyOperation(sockets, callback) {
  //Load spotify credential file
  fs.readFile(SPOTIFY_TOKEN_PATH, (err, content) => {
    if (err)
      return logs.timeLog(
        "[Spotify] Error loading file: " + SPOTIFY_TOKEN_PATH,
        err
      );

    //logs.timeLog("CONTENT: " + content);

    var json = JSON.parse(content);

    var access_token = json.access_token;
    var spotify_access_token_exp = json.token_expire_date;
    var refresh_token = json.refresh_token;

    var expirationDate = new Date(parseInt(spotify_access_token_exp));
    //logs.timeLog("Spotify token expiration date: " + expirationDate)

    var now = new Date();
    var tokenToRefresh = true;

    if (now <= expirationDate) {
      tokenToRefresh = false;
    } else {
      logs.timeLog("[Spotify] Token to refresh");
    }

    var spotifyApi = new SpotifyWebApi({
      clientId: process.env.SPOTIFY_CLIENT_ID,
      clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
    });

    if (tokenToRefresh) {
      spotifyApi.setRefreshToken(refresh_token);

      spotifyApi.refreshAccessToken().then(
        function (data) {
          logs.timeLog("[Spotify] The access token has been refreshed!");

          // Save the refreshed access token
          var access_token = data.body["access_token"];
          var token_expires_in = data.body["expires_in"];

          var now = new Date();
          var expDate = now.setSeconds(now.getSeconds() + token_expires_in);

          spotifyApi.setAccessToken(access_token);
          //Storing refreshed access token in cookies
          var token = {
            access_token: access_token,
            token_expire_date: expDate,
            refresh_token: refresh_token,
          };

          fs.writeFile(SPOTIFY_TOKEN_PATH, JSON.stringify(token), (err) => {
            if (err) console.error(err);
            logs.timeLog(
              "[Spotify] Refreshed token stored in file: ",
              SPOTIFY_TOKEN_PATH
            );
          });

          callback(spotifyApi, sockets);
        },
        function (err) {
          logs.timeLog("[Spotify] Could not refresh the access token", err);
        }
      );
    } else {
      spotifyApi.setAccessToken(access_token);
      callback(spotifyApi, sockets);
    }
  });
}
