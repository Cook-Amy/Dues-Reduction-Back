var pool = require('../database/db');

/*********************************************************
 * 
 * Get all events for CF
 * 
 ********************************************************/
function getAllCfEventsFromDB(seasonID, callback) {
  if(seasonID == 999) {
    var queryDB = "SELECT e.idevent, e.eventDateTime AS Date, e.Title, e.compensated, e.location, " + 
                  "e.venueBonus, e.estimatedCheck, e.estimatedProfit, e.actualCheck, e.payout, " + 
                  "e.discrepancy, e.actualProfit, e.tacPct, e.tacCut, e.drCut, e.eventNotes, " +  
                  "e.closed, e.eventcol, c.shuttleBonusBool, c.shuttleBonusAmount, c.shuttleLocation, " + 
                  "c.totalSales, c.coordinatorAdminAmt " +
                  "FROM event_all e, event_cf c " + 
                  "WHERE e.idevent = c.eventID ";
    var params = [];
  }
  else {
    var queryDB = "SELECT e.idevent, e.eventDateTime AS Date, e.Title, e.compensated, e.location, " + 
                  "e.venueBonus, e.estimatedCheck, e.estimatedProfit, e.actualCheck, e.payout, " + 
                  "e.discrepancy, e.actualProfit, e.tacPct, e.tacCut, e.drCut, e.eventNotes, " +  
                  "e.closed, e.eventcol, c.shuttleBonusBool, c.shuttleBonusAmount, c.shuttleLocation, " + 
                  "c.totalSales, c.coordinatorAdminAmt " +
                  "FROM event_all e, event_cf c " + 
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

/*********************************************************
 * 
 * Insert a new event for CF
 * 
 ********************************************************/
function setNewEventInDB(newEvent, callback) {
  var queryDB = "INSERT INTO event_all (seasonID, venueID, eventDateTime, Title, " +
                                    "compensated, location, venueBonus, estimatedCheck, estimatedProfit, " +
                                    "actualCheck, payout, discrepancy, actualProfit, tacPct, " +
                                    "tacCut, drCut, eventNotes, closed, eventcol) " +
                        "VALUES   (?, 3, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0)";
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
      setNewCfEventInDB(results.insertId, newEvent, callback);
    }
  });
}

function setNewCfEventInDB(id, newEvent, callback) {
  var queryDB = " INSERT INTO event_cf (eventID, shuttleBonusBool, shuttleBonusAmount, shuttleLocation, " +
                                        "totalSales, coordinatorAdminAmt) " +
                        "VALUES (" + id + ", ?, ?, '', ?, ? )";
  var params = [
    newEvent.shuttleBonusBool,
    newEvent.shuttleBonusAmount,
    newEvent.totalSales,
    newEvent.coordinatorAdminAmt
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
 * Edit an event for CF
 * 
 ********************************************************/
function editEventinDB(editEvent, callback) {
  var queryDB = "UPDATE event_all " +
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
      editCfEventinDB(editEvent, callback);
    }
  });
}

function editCfEventinDB(editEvent, callback) {
  var queryDB = "UPDATE event_cf " +
                "SET shuttleBonusBool = ?, shuttleBonusAmount = ?, shuttleLocation = '', " +
                    "totalSales = ?, coordinatorAdminAmt = ? " +
                "WHERE eventID = ?";
  var params = [
    editEvent.shuttleBonusBool,
    editEvent.shuttleBonusAmount,
    editEvent.totalSales,
    editEvent.coordinatorAdminAmt,
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
 * Delete an event for CF
 * 
 ********************************************************/
function deleteCfEventFromDB(eventID, callback) {
  var queryDB = "DELETE FROM event_cf WHERE eventID = ?";
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
  var queryDB = "DELETE FROM event_all WHERE idevent = ?";
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


/*********************************************************
 * 
 * Get season contract for CF
 * 
 ********************************************************/
function getContractCfFromDB(seasonID, callback) {
  var queryDB = "SELECT idcontract_cf, seasonID, cfTaxRate, cfCommission " +
                "FROM contract_cf " +
                "WHERE seasonID = ?";
  var params = [seasonID];  
  
  pool.query(queryDB, params, (error, results) => {
    if(error) {
      console.log("Error getting contract from DB: ");
      console.log(error);
    }
    else {
      // console.log(results);
      callback(null, results);
    }
  });
}

function getCfJobsFromDB(callback) {
  var queryDB = "SELECT idjobs AS jobID, jobName, hourlyRate, isGuarantee, minutesBeforeOpen, venuePay " +
                "FROM jobs " +
                "WHERE venueID = 3";
  
  pool.query(queryDB, (error, results) => {
    if(error) {
      console.log("Error getting jobs from DB: ");
      console.log(error);
    }
    else {
      // console.log(results);
      callback(null, results);
    }
  });
}


module.exports = {
  getAllCfEventsFromDB: getAllCfEventsFromDB,
  setNewEventInDB: setNewEventInDB,
  editEventinDB: editEventinDB,
  deleteCfEventFromDB: deleteCfEventFromDB,
  getContractCfFromDB: getContractCfFromDB,
  getCfJobsFromDB: getCfJobsFromDB
}