var pool = require('../database/db');

function getTuAccountFromDB(id, startDate, endDate, callback) {
  var queryDB = "SELECT p.tuAccountID, tu.accountName " +
                "FROM person p, tu_account tu " +
                "WHERE idperson = ? " +
                "AND p.tuAccountID = tu.idtu_account";
  var params = [id];

  pool.query(queryDB, params, (error, results) => {
    if(error) {
      console.log("Error getting report results from DB: ");
      console.log(error);
    }
    else if(results.length == 0) {
      console.log("Report results not found in DB");
      callback(null, results, results[0].accountName);
    }
    else {
      getAllIDsFromDB(results[0].tuAccountID, results[0].accountName, startDate, endDate, callback);
    }
  });
}

function getAllIDsFromDB(tuID, accountName, startDate, endDate, callback) {
  var queryDB = "SELECT p.idperson " + 
                "FROM person p, tu_account tu " +
                "WHERE tu.idtu_account = " + tuID + " " +
                "AND tu.idtu_account = p.tuAccountID";
  
  pool.query(queryDB, (error, results) => {
    if(error) {
      console.log("Error getting report results from DB: ");
      console.log(error);
    }
    else if(results.length == 0) {
      console.log("Report results not found in DB");
      callback(null, results, accountName);
    }
    else {
      getReportInfoFromDB(results, accountName, startDate, endDate, callback);
    }
  });
}

function getReportInfoFromDB(resultIDs, accountName, startDate, endDate, callback) {
  var queryStr = "SELECT e.title, e.eventDateTime, " +
                      "p.firstName, p.lastName, tu.accountName, " +
                      "t.timeIn, t.timeOut, t.hoursWorked, t.hourlyRate, " +
                      "t.shuttleBonus, t.eventBonus, t.hourlyBonus, t.creditAmount " +
                  "FROM event_all e, person p, timesheet t, tu_account tu " +
                  "WHERE p.idperson = ? " +
                  "AND p.idperson = t.personID " + 
                  "AND e.idevent = t.eventID " +
                  "AND tu.idtu_account = p.tuAccountID " + 
                  "AND t.timeIn <= ?  " + 
                  "AND t.timeIn >= ?; ";

  var queryDB = "";
  var params = [];

  for(var i = 0; i < resultIDs.length; i++) {
    queryDB += queryStr;
    params.push(resultIDs[i].idperson);
    params.push(endDate);
    params.push(startDate);
  }

  pool.query(queryDB, params, (error, results) => {
    if(error) {
      console.log("Error getting report results from DB: ");
      console.log(error);
    }
    else if(results.length == 0) {
      console.log("Report results not found in DB");
      callback(null, results, accountName);
    }
    else {
      callback(null, results, accountName);
    }
  });
}

module.exports = {
  getTuAccountFromDB: getTuAccountFromDB
}