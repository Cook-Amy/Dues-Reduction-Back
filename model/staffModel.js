var pool = require('../database/db');

function getStaffForEventFromDB(eventID, callback) {
  var queryDB = "SELECT per.idperson, CONCAT(per.lastName, ', ', per.firstName) AS Name, j.jobName, t.scheduledArrivalTime, " +
                                            "ppp.pncExperienced, ppp.pncBars, ppp.pncHealthForm, ppp.pncWaiver, ppp.pncBarsRefresher " +
                    "FROM person per, person_pnc_paperwork ppp, timesheet t, jobs j " +
                    "WHERE t.eventID = ? " +
                    "AND t.personID = per.idperson " +
                    "AND t.personID = ppp.personID " +
                    "AND t.jobID = j.idjobs";

  var params = [eventID];

  pool.query(queryDB, params, (error, results) => {
    if(error) {
      console.log("Error getting results from DB: ");
      console.log(error);
    }
    else if(results.length == 0) {
      console.log("Staff not found in DB");
      callback(null, results);
    }
    else {
      // console.log("Events found in DB: ");
      // console.log(results);
      // console.log("Results returned for CF staff: " + results.length);
      callback(null, results);
    }
  });
}

module.exports = {
  getStaffForEventFromDB: getStaffForEventFromDB
}