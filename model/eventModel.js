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

function getTimesheetForEventFromDB (eventID, callback) {
  var queryDB = "SELECT t.idtimesheet, p.firstName, p.lastName, t.personID, j.jobName, t.jobID, t.scheduledArrivalTime, t.hourlyRate, t.timeIn, t.timeOut, t.hoursWorked, t.shuttleBonus, t.eventBonus, t.hourlyBonus, t.creditCardTips, t.creditAmount, j.isGuarantee, j.venuePay " +
                "FROM timesheet t, person p, jobs j " +
                "WHERE t.eventID = ? " +
                "AND t.personID = p.idperson " +
                "AND t.jobID = j.idjobs";
  var params = [eventID];

  pool.query(queryDB, params, (error, results) => {
    if(error) {
      console.log("Error getting results from DB: ");
      console.log(error);
    }
    else if(results.length == 0) {
      console.log("Staff for event not found in DB");
      callback(null, results);
    }
    else {
      // console.log("Staff for event: ");
      // console.log(results);
      callback(null, results);
    }
  });
}

function updateTimesheetInDB(timesheet, callback) {
  var queryDB = "UPDATE timesheet " +
                "SET jobID = ?, scheduledArrivalTime = ?, hourlyRate = ?, " +
                    "timeIn = ?, timeOut = ?, hoursWorked = ?, " +
                    "shuttleBonus = ?, eventBonus = ?, hourlyBonus = ?, "+
                    "creditCardTips = ?, creditAmount = ? " +
                "WHERE idtimesheet = ?";
  var date = new Date(timesheet.scheduledArrivalTime);
  var timeIn = null;
  var timeOut = null;
  if(timesheet.timeIn){
    timeIn = new Date(timesheet.timeIn);
  }
  if(timesheet.timeOut) {
    timeOut = new Date(timesheet.timeOut);
  }
  var params = [
    timesheet.jobID,
    date,
    timesheet.hourlyRate,
    timeIn,
    timeOut,
    timesheet.hoursWorked,
    timesheet.shuttleBonus,
    timesheet.eventBonus,
    timesheet.hourlyBonus,
    timesheet.creditCardTips,
    timesheet.creditAmount,
    timesheet.idtimesheet
  ];

  pool.query(queryDB, params, (error, results) => {
    if(error) {
      console.log("Error setting timesheet in DB: ");
      console.log(error);
    }
    else {
      callback(null, results);
    }
  });
}

module.exports = {
  getEventsFromDB: getEventsFromDB,
  getTimesheetForEventFromDB: getTimesheetForEventFromDB,
  updateTimesheetInDB: updateTimesheetInDB
}