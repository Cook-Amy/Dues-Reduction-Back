var pool = require('../database/db');

function getAllPncEventsFromDB(seasonID, callback) {
  if(seasonID == 999) {
    var queryDB = "SELECT e.idevent, e.Date, e.Title, e.compensated, e.location, " + 
                  "e.venueBonus, e.estimatedCheck, e.estimatedProfit, e.actualCheck, e.payout, " + 
                  "e.discrepancy, e.actualProfit, e.tacPct, e.tacCut, e.drCut, e.eventNotes, " +  
                  "e.closed, e.eventcol, p.metCommissionBonus, p.guarantee, p.totalSales, " + 
                  "p.alcSales, p.coordinatorAdminAmt, p.eventCountsTowardsTotal " +
                  "FROM event e, event_pnc p " + 
                  "WHERE e.idevent = p.eventID ";
    var params = [];
  }
  else {
    var queryDB = "SELECT e.idevent, e.Date, e.Title, e.compensated, e.location, " + 
                  "e.venueBonus, e.estimatedCheck, e.estimatedProfit, e.actualCheck, e.payout, " + 
                  "e.discrepancy, e.actualProfit, e.tacPct, e.tacCut, e.drCut, e.eventNotes, " +  
                  "e.closed, e.eventcol, p.metCommissionBonus, p.guarantee, p.totalSales, " + 
                  "p.alcSales, p.coordinatorAdminAmt, p.eventCountsTowardsTotal " +
                  "FROM event e, event_pnc p " + 
                  "WHERE e.idevent = p.eventID " +
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
      callback(null, results);
    }
  });
}

function setNewEventInDB(newEvent, callback) {
  var queryDB = "INSERT INTO event (seasonID, venueID, Date, Title, " +
                                    "compensated, location, venueBonus, estimatedCheck, estimatedProfit, " +
                                    "actualCheck, payout, discrepancy, actualProfit, tacPct, " +
                                    "tacCut, drCut, eventNotes, closed, eventcol) " +
                        "VALUES   (?, 1, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0)";
  var params = [
    newEvent.season,
    newEvent.Date,
    newEvent.Title,
    newEvent.compensated,
    newEvent.location,
    newEvent.venueBonus,
    newEvent.estimatedCheck,
    newEvent.estimatedProfit,
    newEvent.actualCheck,
    newEvent.payout,
    newEvent.discrepancy,
    newEvent.actualProfit,
    newEvent.tacPct,
    newEvent.tacCut,
    newEvent.drCut,
    newEvent.eventNotes,
    newEvent.closed
  ];

  pool.query(queryDB, params, (error, results) => {
    if(error) {
      console.log("Error setting new event into DB: ");
      console.log(error);
    }
    else {
      setNewPncEventInDB(results.insertId, newEvent, callback);
    }
  });
}

function setNewPncEventInDB(id, newEvent, callback) {
  var queryDB = " INSERT INTO event_pnc (eventID, metCommissionBonus, guarantee, totalSales, " +
                                        "alcSales, coordinatorAdminAmt, eventCountsTowardsTotal) " +
                        "VALUES (" + id + ", ?, ?, ?, ?, ?, ?)";
  var params = [
    newEvent.metCommissionBonus,
    newEvent.guarantee,
    newEvent.totalSales,
    newEvent.alcSales,
    newEvent.coordinatorAdminAmount,
    newEvent.eventCountsTowardsTotal
  ];

  pool.query(queryDB, params, (error, results) => {
    if(error) {
      console.log("Error setting new event into DB: ");
      console.log(error);
    }
    else {
      callback(null, results);
    }
  });
}

module.exports = {
  getAllPncEventsFromDB: getAllPncEventsFromDB,
  setNewEventInDB: setNewEventInDB,
  setNewPncEventInDB: setNewPncEventInDB
}

