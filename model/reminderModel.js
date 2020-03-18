var pool = require('../database/db');

function getEmailforReminder(emailList, eventID, callback) {
  var queryStr = "SELECT p.firstName, p.lastName, p.email, e.Title, e.eventDateTime, e.location, j.jobName, t.scheduledArrivalTime " +
                "FROM person p, timesheet t, event_all e, jobs j " +
                "WHERE p.idperson = t.personID " +
                "AND t.jobID = j.idjobs " +
                "AND e.idevent = ? " +
                "AND e.idevent = t.eventID " +
                "AND t.idtimesheet = ?; ";

  var queryDB = "";
  var params = [];

  for(var i = 0; i < emailList.length; i++) {
    queryDB += queryStr;
    params.push(eventID);
    params.push(emailList[i].id);
  }

  pool.query(queryDB, params, (error, results) => {
    if(error) {
      console.log("Error getting results from DB: ");
      console.log(error);
    }
    else {
      callback(null, results);
    }
  });
}

module.exports = {
  getEmailforReminder: getEmailforReminder
}