var pool = require('../database/db');


/*********************************************************
 * 
 * Get all events for PNC
 * 
 ********************************************************/
function getAllPncEventsFromDB(seasonID, callback) {
  if(seasonID == 999) {
    var queryDB = "SELECT e.idevent, e.eventDateTime AS Date, e.Title, e.compensated, e.location, " + 
                  "e.venueBonus, e.estimatedCheck, e.estimatedProfit, e.actualCheck, e.payout, " + 
                  "e.discrepancy, e.actualProfit, e.tacPct, e.tacCut, e.drCut, e.eventNotes, " +  
                  "e.closed, e.eventcol, p.metCommissionBonus, p.guarantee, p.totalSales, " + 
                  "p.alcSales, p.coordinatorAdminAmt, p.eventCountsTowardsTotal " +
                  "FROM event e, event_pnc p " + 
                  "WHERE e.idevent = p.eventID ";
    var params = [];
  }
  else {
    var queryDB = "SELECT e.idevent, e.eventDateTime AS Date, e.Title, e.compensated, e.location, " + 
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


/*********************************************************
 * 
 * Insert a new event for PNC
 * 
 ********************************************************/
function setNewEventInDB(newEvent, callback) {
  var queryDB = "INSERT INTO event (seasonID, venueID, eventDateTime, Title, " +
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
                        "VALUES (" + id + ", ?, ?, ?, ?, ?, ?, ?)";
  var params = [
    newEvent.metCommissionBonus,
    newEvent.guarantee,
    newEvent.totalSales,
    newEvent.alcSales,
    newEvent.coordinatorAdminAmt,
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


/*********************************************************
 * 
 * Edit an event for PNC
 * 
 ********************************************************/
function editEventinDB(editEvent, callback) {
  var queryDB = "UPDATE event " +
                "SET eventDateTime = ?, Title = ?, compensated = ?, location = ?, " +
                    "venueBonus = ?, estimatedCheck = ?, estimatedProfit = ?, actualCheck = ?, " +
                    "payout = ?, discrepancy = ?, actualProfit = ?, tacPct = ?, " +
                    "tacCut = ?, drCut = ?, eventNotes = ?, closed = ? " +
                "WHERE idevent = ?";
  var params = [
    editEvent.Date,
    editEvent.Title,
    editEvent.compensated,
    editEvent.location,
    editEvent.venueBonus,
    editEvent.estimatedCheck,
    editEvent.estimatedProfit,
    editEvent.actualCheck,
    editEvent.payout,
    editEvent.discrepancy,
    editEvent.actualProfit,
    editEvent.tacPct,
    editEvent.tacCut,
    editEvent.drCut,
    editEvent.eventNotes,
    editEvent.closed,
    editEvent.idevent
  ];

  pool.query(queryDB, params, (error, results) => {
    if(error) {
      console.log("Error setting new event into DB: ");
      console.log(error);
    }
    else {
      editPncEventinDB(editEvent, callback);
    }
  });
}

function editPncEventinDB(editEvent, callback) {
  var queryDB = "UPDATE event_pnc " +
                "SET metCommissionBonus = ?, guarantee = ?, totalSales = ?, " +
                    "alcSales = ?, coordinatorAdminAmt = ?, eventCountsTowardsTotal = ? " +
                "WHERE eventID = ?";
  var params = [
    editEvent.metCommissionBonus,
    editEvent.guarantee,
    editEvent.totalSales,
    editEvent.alcSales,
    editEvent.coordinatorAdminAmt,
    editEvent.eventCountsTowardsTotal,
    editEvent.idevent
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


/*********************************************************
 * 
 * Delete an event for PNC
 * 
 ********************************************************/
function deletePncEventFromDB(eventID, callback) {
  var queryDB = "DELETE FROM event_pnc WHERE eventID = ?";
  var params = [eventID];

  pool.query(queryDB, params, (error, results) => {
    if(error) {
      console.log("Error setting new event into DB: ");
      console.log(error);
    }
    else {
      deleteTimesheetFromDB(eventID, callback);
    }
  });
}

function deleteTimesheetFromDB(eventID, callback) {
  var queryDB = "DELETE FROM timesheet WHERE eventID = ?";
  var params = [eventID];

  pool.query(queryDB, params, (error, results) => {
    if(error) {
      console.log("Error setting new event into DB: ");
      console.log(error);
    }
    else {
      deleteEventFromDB(eventID, callback);
    }
  });
}

function deleteEventFromDB(eventID, callback) {
  var queryDB = "DELETE FROM event WHERE idevent = ?";
  var params = [eventID];

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
  editEventinDB: editEventinDB,
  deletePncEventFromDB: deletePncEventFromDB
}

