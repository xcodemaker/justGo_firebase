const functions = require("firebase-functions");
const polyline = require("google-polyline");
const admin = require("firebase-admin");
const Math = require("mathjs");
admin.initializeApp(functions.config().firebase);
const db = admin.firestore();
const mataleLine = require("./railLines/mataleLine")
const mainLine = require('./railLines/mainLine')
const coastalLine = require('./railLines/coastalLine')
const kelaniValleyLine = require('./railLines/kelaniValleyLine')
const puttalamLine = require('./railLines/puttalamLine')
const northernLine = require('./railLines/northernLine')
const mannarLine = require('./railLines/mannarLine')
const trincomaleeLine = require('./railLines/trincomaleeLine')
const batticaloaLine = require('./railLines/batticaloaLine')

const geolib = require("geolib");


exports.arrivalTimePrediction = functions.https.onRequest(async (req, res) => {
  const trainRunId = req.body.trainRunId;
  const trainRunDoc = await db.doc("trains/" + trainRunId).get();
  const time = trainRunDoc.data().current_location.time_stamp._seconds;

  const previousLocationsAll = trainRunDoc.data().previous_locations;

  const start = {
    latitude: trainRunDoc.data().current_location.location._latitude,
    longitude: trainRunDoc.data().current_location.location._longitude
  };

  const end = {
    latitude: req.body.end._latitude,
    longitude: req.body.end._longitude
  };

  const path = [];

  const distance = calc_total_distance(start, end, path);
  const avgSpeed = calcAverageSpeed(previousLocationsAll, time, 30);
  if (avgSpeed === null) {
    return res.status(500).json({
      message: "not enough data",
      previousLocations: previousLocationsAll
    });
  }
  const ETA = distance / avgSpeed;

  res.status(200).json({
    start: start,
    end: end,
    distance: distance,
    avgSpeed: avgSpeed,
    ETA: ETA
  });
});


exports.pushRailLines = functions.https.onRequest(async (req, res) => {


  var coastalLineSegments = [];
  var kelaniValleyLineSegments = [];
  var mainLineSegments = [];
  var mataleLineSegments = [];
  var puttalamLineSegments = [];
  var northernLineSegments = [];
  var batticaloaLineSegments = [];
  var trincomaleeLineSegments = [];
  var mannarLineSegments = [];

  var allRailLines = [
    coastalLine,
    kelaniValleyLine,
    mainLine,
    mataleLine,
    puttalamLine,
    northernLine,
    batticaloaLine,
    trincomaleeLine,
    mannarLine
  ];

  var allRailLinesSegments = [
    coastalLineSegments,
    kelaniValleyLineSegments,
    mainLineSegments,
    mataleLineSegments,
    puttalamLineSegments,
    northernLineSegments,
    batticaloaLineSegments,
    trincomaleeLineSegments,
    mannarLineSegments
  ];
  for (var i = 0; i < allRailLinesSegments.length; i++) {
    for (var x = 0; x < allRailLines[i].length; x++) {
      allRailLinesSegments[i].push(
        new admin.firestore.GeoPoint(
          allRailLines[i][x][0],
          allRailLines[i][x][1]
        )
      );
    }
  }

  await db
    .doc("rail_lines/coastalLine")
    .set({ coordinates: allRailLinesSegments[0] });
  await db
    .doc("rail_lines/kelaniValleyLine")
    .set({ coordinates: allRailLinesSegments[1] });
  await db
    .doc("rail_lines/mainLine")
    .set({ coordinates: allRailLinesSegments[2] });
  await db
    .doc("rail_lines/mataleLine")
    .set({ coordinates: allRailLinesSegments[3] });
  await db
    .doc("rail_lines/puttalamLine")
    .set({ coordinates: allRailLinesSegments[4] });
  await db
    .doc("rail_lines/northernLine")
    .set({ coordinates: allRailLinesSegments[5] });
  await db
    .doc("rail_lines/batticaloaLine")
    .set({ coordinates: allRailLinesSegments[6] });
  await db
    .doc("rail_lines/trincomaleeLine")
    .set({ coordinates: allRailLinesSegments[7] });
  await db
    .doc("rail_lines/mannarLine")
    .set({ coordinates: allRailLinesSegments[8] });

  res.status(200).json({
    message: "computation completed",
    coastalLine,
    kelaniValleyLine,
    puttalamLine,
    northernLine,
  });
});

var calc_total_distance = function(start, end, path) {
  var endIndex = 0;

  for (var k = 0; k <= path.length; k++) {
    if (path[k][0] === end.longitude && path[k][1] === end.latitude) {
      endIndex = k;
      break;
    }
  }

  var minValue = Infinity;
  var startIndex = 0;

  for (var i = 0; i <= endIndex; i++) {
    var pointa = {
      latitude: path[i][1],
      longitude: path[i][0]
    };

    var dist = geolib.getDistanceSimple(start, pointa);

    if (dist < minValue) {
      startIndex = i;
      minValue = dist;
    }
  }

  var distance = 0;

  for (var j = startIndex; j <= endIndex - 1; j++) {
    var pointb = {
      latitude: path[j][1],
      longitude: path[j][0]
    };
    var pointc = {
      latitude: path[j + 1][1],
      longitude: path[j + 1][0]
    };
    distance += geolib.getDistance(pointb, pointc);
  }

  return distance;
};

var appendLeadingZeros = function(value) {
  if (value.length < 2) {
    return "0" + value;
  } else {
    return value;
  }
};

var calcAverageSpeed = function(previousLocationsAll, time, limit) {
  const timeLimit = time - limit;
  const previousLocationsSelected = [];

  for (var i = 0; i < previousLocationsAll.length; i++) {
    var time_stamp = previousLocationsAll[i].time_stamp._seconds;
    if (time_stamp > timeLimit) {
      previousLocationsSelected.push(previousLocationsAll[i]);
    }
  }

  console.log(previousLocationsSelected);
  if (previousLocationsSelected.length < 2) {
    return null;
  }

  var speedArray = [];
  for (var j = 0; j < previousLocationsSelected.length - 1; j++) {
    var pointA = {
      latitude: previousLocationsSelected[j].location._latitude,
      longitude: previousLocationsSelected[j].location._longitude
    };
    var pointB = {
      latitude: previousLocationsSelected[j + 1].location._latitude,
      longitude: previousLocationsSelected[j + 1].location._longitude
    };
    var deltaTime =
      previousLocationsSelected[j + 1].time_stamp._seconds -
      previousLocationsSelected[j].time_stamp._seconds;
    return geolib.getDistance(pointA, pointB) / deltaTime;
  }
  var speedSum = 0;
  for (var k = 0; k < speedArray.length; k++) {
    speedSum += speedArray[k];
  }
  return speedSum / speedArray.length;
};


exports.getCurrentLocation = functions.https.onRequest(async (req, res) => {
  const trainId = "1";
  const userId = "1";
  const path = [];
  const trainRunDoc = await db.doc("trains/" + trainId).get();
  const user_location_list = trainRunDoc.data().location_list;

  var latitude_list = [];
  var longitude_list = [];

  if (user_location_list === null) {
    return res.status(500).json({
      message: "not enough data",
      previousLocations: previousLocationsAll
    });
  }

  trainRunDoc.forEach(element => {
    latitude_list.push(element.data().location.latitude);
    longitude_list.push(element.data().location.longitude);
  });

  var latitude_sum = 0;
  var longitude_sum = 0;

  for (var i = 0; i < latitude_list.length; i++) {
    latitude_sum += latitude_list[i];
  }
  for (var j = 0; j < longitude_list.length; j++) {
    longitude_sum += longitude_list[j];
  }

  var average_latitude = latitude_sum / latitude_list.length;
  var average_longitude = longitude_sum / longitude_list.length;

  const div_latitude = standardDeviation(latitude_list);
  const div_longitude = standardDeviation(longitude_list);

  var c = 0;

  while (c < longitude_list.length) {
    if (
      (longitude_list[c] > div_longitude + average_longitude) |
      (longitude_list[c] < average_longitude - div_longitude)
    ) {
      longitude_list.splice(c, 1);
      latitude_list.splice(c, 1);
    } else {
      if (
        (latitude_list[c] > div_latitude + average_latitude) |
        (latitude_list[c] < average_latitude - div_latitude)
      ) {
        latitude_list.splice(c, 1);
        longitude_list.splice(c, 1);
      } else {
        c = c + 1;
      }
    }
  }

  latitude_sum = 0;
  longitude_sum = 0;

  for (i = 0; i < latitude_list.length; i++) {
    latitude_sum += latitude_list[i];
  }
  for (j = 0; j < longitude_list.length; j++) {
    longitude_sum += longitude_list[j];
  }

  average_latitude = latitude_sum / latitude_list.length;
  average_longitude = longitude_sum / longitude_list.length;

  var minDistance = Infinity;
  var correctIndex = 0;

  var average_location = {
    latitude: average_latitude,
    longitude: average_longitude
  };

  for (var k = 0; k < path.length; k++) {
    var pointa = {
      longitude: path[k][0],
      latitude: path[k][1]
    };

    var dist = geolib.getDistance(average_location, pointa);

    if (dist < minDistance) {
      correctIndex = k;
      minDistance = dist;
    }
  }

  var train_current_location = new admin.firestore.GeoPoint(
    path[correctIndex][1],
    path[correctIndex][0]
  );
  var timestamp = admin.firestore.Timestamp.fromDate(new Date());

  var c_location = {
    location: train_current_location,
    time: timestamp
  };

  db.doc("trains/" + trainId).set({ current_location: c_location });

  res.status(200).json({
    message: "reached getCurrentLocation",
    lat: path[correctIndex][1],
    lon: path[correctIndex][0],
    avg_lat: average_latitude,
    avg_lon: average_longitude,
    minDistance: minDistance,
    div_lat: div_latitude,
    div_lon: div_longitude,
    kValue: k
  });
});

//get standard deviation
function standardDeviation(values) {
  var avg = average(values);

  var squareDiffs = values.map((value) => {
    var diff = value - avg;
    var sqrDiff = diff * diff;
    return sqrDiff;
  });

  var avgSquareDiff = average(squareDiffs);

  var stdDev = Math.sqrt(avgSquareDiff);
  return stdDev;
}

function average(data) {
  var sum = data.reduce((sum, value) => {
    return sum + value;
  }, 0);

  var avg = sum / data.length;
  return avg;
}
