var pool = require('../database/db');

function getEmailforReminder(emailList, eventID, userID, callback) {
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
      updateReminderDateInDB(emailList, results, userID, callback);
    }
  });
}

function updateReminderDateInDB(emailList, jobList, userID, callback) {
  var queryStr = "UPDATE timesheet " +
                "SET lastReminder = ? " +
                "WHERE idtimesheet = ?; ";
  var queryDB = "";
  var params = [];
  var date = new Date().toISOString();

  for(var i = 0; i < emailList.length; i++) {
    queryDB += queryStr;
    params.push(date);
    params.push(emailList[i].id);
  }

  pool.query(queryDB, params, (error, results) => {
    if(error) {
      console.log("Error getting results from DB: ");
      console.log(error);
    }
    else {
      getCoordinatorInfoFromDB(jobList, userID, callback);
    }
  });
}

function getCoordinatorInfoFromDB(jobList, userID, callback) {
  queryDB = "SELECT firstName, lastName, phone, titansEmail, gmailPasscode " +
            "FROM site_user " + 
            "WHERE idsite_user = ? ";
  params = [userID];

  pool.query(queryDB, params, (error, results) => {
    if(error) {
      console.log("Error getting results from DB: ");
      console.log(error);
    }
    else {
      callback(null, jobList, results[0]);
    }
  });
}

module.exports = {
  getEmailforReminder: getEmailforReminder
}