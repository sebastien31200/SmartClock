var usbDetect = require("usb-detection");
const fs = require("fs");
const path = require("path");
var raspberry = require("./raspberry.js");
var logs = require("../log.js");

var garminVid = "2334"; //Garmin vendor id

exports.startMonitoring = function(sockets) {
  logs.timeLog("[Garmin] Start USB monitoring");
  usbDetect.startMonitoring();

  // Detect add/insert, filter on garminVid
  usbDetect.on("add:" + garminVid, function(device) {
    logs.timeLog("[Garmin] New USB device: ");
    console.log(device);
    vid = device.vendorId;
    if (vid == garminVid) {
      logs.timeLog("[Garmin] Garmin device: upload activity");
      sockets.emit("usbConnectionMessage");
      setTimeout(() => {
        uploadLatestActivity(sockets);
      }, 4000);
    }
  });
};

// Find connected devices, filter on garminVid
/* usbDetect.find(garminVid, function(err, devices) {
  console.log("Found devices:", devices, err);
  devices.forEach(device => {
    vid = device.vendorId;
    if (vid == garminVid) {
      console.log("Garmin USB device detected");
      uploadLatestActivity();
    }
  });
}); */

function uploadLatestActivity(sockets) {
  var activityFilesPath = "/media/pi/GARMIN/GARMIN/ACTIVITY";
  var latestActivity = getMostRecentFile(activityFilesPath);
  raspberry.execCommand(
    "gupload " + activityFilesPath + "/" + latestActivity.file
  );
  sockets.emit("activityUploadMessage");
}

const getMostRecentFile = dir => {
  const files = orderRecentFiles(dir);
  return files.length ? files[0] : undefined;
};

const orderRecentFiles = dir => {
  return fs
    .readdirSync(dir)
    .filter(file => fs.lstatSync(path.join(dir, file)).isFile())
    .map(file => ({ file, mtime: fs.lstatSync(path.join(dir, file)).mtime }))
    .sort((a, b) => b.mtime.getTime() - a.mtime.getTime());
};
