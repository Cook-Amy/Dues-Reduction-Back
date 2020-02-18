var pool = require('../database/db');

function getEventsFromDB (venueID, seasonID, callback) {
  if(seasonID == 999) {
    var queryDB = "SELECT * FROM event WHERE venueID = ?";
    var params = [venueID];
  }
  else {
    var queryDB = "SELECT * FROM event WHERE venueID = ? AND seasonID = ?";
    var params = [venueID, seasonID];
  }

  pool.query(queryDB, params, (error, results) => {
    if(error) {
      console.log("Error getting results from DB: ");
      console.log(error);
    }
    else if(results.length == 0) {
      console.log("Events not found in DB");
      callback(null, results);
    }
    else {
      callback(null, results);
    }
  });
}

module.exports = {
  getEventsFromDB: getEventsFromDB
}