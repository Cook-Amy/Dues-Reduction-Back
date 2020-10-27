var pool = require('../database/db');

function getAdminReport1FromDB(specs, userID, callback) {
  var selectStm = 'v.shortName AS Venue';
  if(specs.eventDate)
    selectStm += ', DATE_FORMAT(e.eventDateTime, "%c/%e/%Y") AS "Event Date"';
  if(specs.eventName)
    selectStm += ', e.Title';
  if(specs.eventLocation)
    selectStm += ', e.location AS Location';
  if(specs.eventPayout)
    selectStm += ', ROUND(e.payout, 2) AS Payout';
  if(specs.eventCheck)
    selectStm += ', ROUND(e.actualCheck, 2) AS "Check Received"';
  if(specs.eventBonus)
    selectStm += ', ROUND(e.venueBonus, 2) AS "Venue Bonus"';
  if(specs.eventDiscrepancy)
    selectStm += ', ROUND(e.discrepancy, 2) AS Discrepancy';
  if(specs.eventProfit)
    selectStm += ', ROUND(e.actualProfit, 2) AS Profit';

    var query = "SELECT " + selectStm +
                " FROM event_all e, venue v " +
                "WHERE e.eventDateTime > ? AND e.eventDateTime < ? " +
                "AND e.payout > 0 " +
                "AND v.idvenue = e.venueID " +
                "ORDER BY eventDateTime";
  params = [specs.start, specs.end];

  pool.query(query, params, (error, results) => {
    if(error) {
      console.log("Error getting report results from DB: ");
      console.log(error);
    }
    else if(results.length == 0) {
      console.log("Report results not found in DB");
      callback(null, null, null);
    }
    else {
      getCoordinatorEmailFromDB(userID, results, callback);
    }
  });
}

function getCoordinatorEmailFromDB(userID, report, callback) {
  queryDB = "SELECT CONCAT(firstName, ' ', lastName) AS name, titansEmail, gmailPasscode " +
            "FROM site_user " + 
            "WHERE idsite_user = ? ";
  var params = [userID];

  pool.query(queryDB, params, (error, results) => {
    if(error) {
      console.log("Error getting report results from DB: ");
      console.log(error);
    }
    else if(results.length == 0) {
      console.log("Coordinator results not found in DB");
      callback(null, report, null);
    }
    else {
      callback(null, report, results );
    }
  });
}

module.exports = {
  getAdminReport1FromDB: getAdminReport1FromDB
}