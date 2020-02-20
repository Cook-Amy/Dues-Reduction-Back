var pool = require('../database/db');

function getAllWcEventsFromDB(seasonID, callback) {
  if(seasonID == 999) {
    var queryDB = "SELECT e.idevent, e.Date, e.Title, e.compensated, e.location, " + 
                  "e.venueBonus, e.estimatedCheck, e.estimatedProfit, e.actualCheck, e.payout, " + 
                  "e.discrepancy, e.actualProfit, e.tacPct, e.tacCut, e.drCut, e.eventNotes, " +  
                  "e.closed, e.eventcol, w.shuttleBonusBool, w.shuttleBonusAmount, w.creditCardTips,  " + 
                  "w.maxCreditCardTipAmount, w.coordinatorAdminAmt " +
                  "FROM event e, event_wc w " + 
                  "WHERE e.idevent = w.eventID ";
    var params = [];
  }
  else {
    var queryDB = "SELECT e.idevent, e.Date, e.Title, e.compensated, e.location, " + 
                  "e.venueBonus, e.estimatedCheck, e.estimatedProfit, e.actualCheck, e.payout, " + 
                  "e.discrepancy, e.actualProfit, e.tacPct, e.tacCut, e.drCut, e.eventNotes, " +  
                  "e.closed, e.eventcol, w.shuttleBonusBool, w.shuttleBonusAmount, w.creditCardTips,  " + 
                  "w.maxCreditCardTipAmount, w.coordinatorAdminAmt " +
                  "FROM event e, event_wc w " + 
                  "WHERE e.idevent = w.eventID " +
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
  getAllWcEventsFromDB: getAllWcEventsFromDB
}