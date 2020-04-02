var pool = require('../database/db');

function getDataFromDB(startDate, endDate, userID, callback) {
  var queryDB = "SELECT p.firstName, p.lastName, e.Title, e.eventDateTime, t.creditAmount, tu.accountName, tu.idtu_account " +
                  "FROM person p, timesheet t, event_all e, tu_account tu " +
                  "WHERE p.idperson = t.personID " +
                  "AND p.tuAccountID = tu.idtu_account " +
                  "AND t.eventID = e.idevent " +
                  "AND e.eventDateTime >= ? " +
                  "AND e.eventDateTime <= ? " +
                  "ORDER BY tu.accountName;";
  var params = [
    startDate,
    endDate
  ]

  pool.query(queryDB, params, (error, results) => {
    if(error) {
      console.log("Error getting report results from DB: ");
      console.log(error);
    }
    else if(results.length == 0) {
      console.log("Report results not found in DB");
      callback(null, results, '', '');
    }
    else {
      getCoordinatorInfoFromDB(results, userID, callback);
    }
  });
}

function getCoordinatorInfoFromDB(data, userID, callback) {
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
      callback(null, data, '', '');

    }
    else {
      callback(null, data, results[0].titansEmail, results[0].gmailPasscode);
    }
  });
}

module.exports = {
  getDataFromDB: getDataFromDB
}