var pool = require('../database/db');

function getTuAccountFromDB(id, startDate, endDate, userID, callback) {
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
      callback(null, null, 0, results[0].accountName, '', '', '');
    }
    else {
      getEmailFromDB(id, results[0].tuAccountID, results[0].accountName, startDate, endDate, userID, callback);
    }
  });
}

function getEmailFromDB(id, tuID, accountName, startDate, endDate, userID, callback) {
  var queryDB= "SELECT email FROM person WHERE idperson = ?";
  var params = [id];

  pool.query(queryDB, params, (error, results) => {
    if(error) {
      console.log("Error getting report results from DB: ");
      console.log(error);
    }
    else if(results.length == 0) {
      console.log("Report results not found in DB");
      callback(null, null, 0, accountName, results[0].email, '', '');
    }
    else {
      getAllIDsFromDB(tuID, accountName, startDate, endDate, results[0].email, userID, callback);
    }
  });

}

function getAllIDsFromDB(tuID, accountName, startDate, endDate, email, userID, callback) {
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
      callback(null, null, 0, accountName, email, '', '');
    }
    else {
      getReportInfoFromDB(results, accountName, startDate, endDate, email, userID, callback);
    }
  });
}

function getReportInfoFromDB(resultIDs, accountName, startDate, endDate, email, userID, callback) {
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
  var idCount = 0;

  for(var i = 0; i < resultIDs.length; i++) {
    queryDB += queryStr;
    params.push(resultIDs[i].idperson);
    params.push(endDate);
    params.push(startDate);
    idCount++;
  }

  pool.query(queryDB, params, (error, results) => {
    if(error) {
      console.log("Error getting report results from DB: ");
      console.log(error);
    }
    else if(results.length == 0) {
      console.log("Report results not found in DB");
      callback(null, null, idCount, accountName, email, '', '');
    }
    else {
      getCoordinatorInfoFromDB(results, idCount, accountName, email, userID, callback);
    }
  });
}

function getCoordinatorInfoFromDB(report, idCount, accountName, email, userID, callback) {
  queryDB = "SELECT titansEmail, gmailPasscode " +
            "FROM site_user " + 
            "WHERE idsite_user = ? ";
  params = [userID];

  pool.query(queryDB, params, (error, results) => {
    if(error) {
      console.log("Error getting report results from DB: ");
      console.log(error);
    }
    else if(results.length == 0) {
      console.log("Report results not found in DB");
      callback(null, report, idCount, accountName, email, '', '');
    }
    else {
      callback(null, report, idCount, accountName, email, results[0].titansEmail, results[0].gmailPasscode);
    }
  });

}

