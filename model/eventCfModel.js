var pool = require('../database/db');

function getAllCfEventsFromDB(seasonID, callback) {
  if(seasonID == 999) {
    var queryDB = "SELECT e.idevent, e.eventDateTime AS Date, e.Title, e.compensated, e.location, " + 
                  "e.venueBonus, e.estimatedCheck, e.estimatedProfit, e.actualCheck, e.payout, " + 
                  "e.discrepancy, e.actualProfit, e.tacPct, e.tacCut, e.drCut, e.eventNotes, " +  
                  "e.closed, e.eventcol, c.shuttleBonusBool, c.shuttleBonusAmount, c.shuttleLocation, " + 
                  "c.totalSales, c.coordinatorAdminAmt " +
                  "FROM event e, event_cf c " + 
                  "WHERE e.idevent = c.eventID ";
    var params = [];
  }
  else {
    var queryDB = "SELECT e.idevent, e.eventDateTime AS Date, e.Title, e.compensated, e.location, " + 
                  "e.venueBonus, e.estimatedCheck, e.estimatedProfit, e.actualCheck, e.payout, " + 
                  "e.discrepancy, e.actualProfit, e.tacPct, e.tacCut, e.drCut, e.eventNotes, " +  
                  "e.closed, e.eventcol, c.shuttleBonusBool, c.shuttleBonusAmount, c.shuttleLocation, " + 
                  "c.totalSales, c.coordinatorAdminAmt " +
                  "FROM event e, event_cf c " + 
                  "WHERE e.idevent = c.eventID " +
                  "AND e.seasonID = ?";
    var params = [seasonID];
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
      // console.log("Events found in DB: ");
      // console.log(results);
      callback(null, results);
    }
  });
}

module.exports = {
  getAllCfEventsFromDB: getAllCfEventsFromDB
}