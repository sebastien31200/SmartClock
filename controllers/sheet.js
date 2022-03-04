const fs = require("fs");
const readline = require("readline");
const { google } = require("googleapis");
var logs = require("../log.js");

// If modifying these scopes, delete token.json.
const SCOPES = ["https://www.googleapis.com/auth/spreadsheets"];
// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.
const CREDENTIALS_PATH = "./controllers/config/credentials.json";
const TOKEN_PATH = "./controllers/config/token.json";

//https://docs.google.com/spreadsheets/d/1xccxPTiHqKapjVPyY-qVHMk3cE-ys63KmAQkDDDiefo/edit
const SHEET_ID = "1xccxPTiHqKapjVPyY-qVHMk3cE-ys63KmAQkDDDiefo";

exports.addNewSheetRow = function (row) {
  // Load client secrets from a local file.
  fs.readFile(CREDENTIALS_PATH, (err, content) => {
    if (err) return console.log("Error loading client secret file:", err);
    // Authorize a client with credentials, then call the Google Sheets API.
    authorize(JSON.parse(content), addNewRow, SHEET_ID, row);
  });
};

function addNewRow(auth, sheetId, row) {
  const sheets = google.sheets({ version: "v4", auth });
  let resource = {
    values: row,
  };
  sheets.spreadsheets.values.append(
    {
      spreadsheetId: sheetId,
      range: "Feuille 1!A1",
      valueInputOption: "RAW",
      resource: resource,
    },
    (err, res) => {
      if (err) {
        return logs.timeLog("The API returned an error: " + err);
      } else {
        var cells = res.data.updates.updatedCells;
        var ranges = res.data.updates.updatedRange;
        logs.timeLog(
          "[SheetAPI] " + cells + " cells updated on range: " + ranges
        );
      }
    }
  );
}

/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 * @param {Object} credentials The authorization client credentials.
 * @param {function} callback The callback to call with the authorized client.
 */
function authorize(credentials, callback, sheetId, row) {
  const { client_secret, client_id, redirect_uris } = credentials.installed;
  const oAuth2Client = new google.auth.OAuth2(
    client_id,
    client_secret,
    redirect_uris[0]
  );

  // Check if we have previously stored a token.
  fs.readFile(TOKEN_PATH, (err, token) => {
    if (err) return getNewToken(oAuth2Client, callback);
    oAuth2Client.setCredentials(JSON.parse(token));
    callback(oAuth2Client, sheetId, row);
  });
}

/**
 * Get and store new token after prompting for user authorization, and then
 * execute the given callback with the authorized OAuth2 client.
 * @param {google.auth.OAuth2} oAuth2Client The OAuth2 client to get token for.
 * @param {getEventsCallback} callback The callback for the authorized client.
 */
function getNewToken(oAuth2Client, callback) {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: "offline",
    scope: SCOPES,
  });
  console.log("Authorize this app by visiting this url:", authUrl);
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  rl.question("Enter the code from that page here: ", (code) => {
    rl.close();
    oAuth2Client.getToken(code, (err, token) => {
      if (err)
        return console.error(
          "Error while trying to retrieve access token",
          err
        );
      oAuth2Client.setCredentials(token);
      // Store the token to disk for later program executions
      fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
        if (err) return console.error(err);
        console.log("Token stored to", TOKEN_PATH);
      });
      callback(oAuth2Client);
    });
  });
}
/* 
let values = [
  ["Chris", "Male", "1. Freshman", "FL", "Art", "Baseball"],
]; 
addNewSheetRow(values)
*/
