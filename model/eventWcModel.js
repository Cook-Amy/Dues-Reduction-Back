var pool = require('../database/db');

/*********************************************************
 *
 * Get all events for WC
 *
 ********************************************************/
function getAllWcEventsFromDB(seasonID, callback) {
  if(seasonID == 999) {
    var queryDB = "SELECT e.idevent, e.eventDateTime AS Date, e.Title, e.compensated, e.location, " +
                  "e.venueBonus, e.estimatedCheck, e.estimatedProfit, e.actualCheck, e.payout, " +
                  "e.discrepancy, e.actualProfit, e.tacPct, e.tacCut, e.drCut, e.eventNotes, " +
                  "e.closed, e.eventcol, w.shuttleBonusAmount, w.creditCardTips, w.totalSales, " +
                  "w.maxCreditCardTipAmount, w.coordinatorAdminAmt " +
                  "FROM event_all e, event_wc w " +
                  "WHERE e.idevent = w.eventID ";
    var params = [];
  }
  else {
    var queryDB = "SELECT e.idevent, e.eventDateTime AS Date, e.Title, e.compensated, e.location, " +
                  "e.venueBonus, e.estimatedCheck, e.estimatedProfit, e.actualCheck, e.payout, " +
                  "e.discrepancy, e.actualProfit, e.tacPct, e.tacCut, e.drCut, e.eventNotes, " +
                  "e.closed, e.eventcol, w.shuttleBonusAmount, w.creditCardTips, w.totalSales, " +
                  "w.maxCreditCardTipAmount, w.coordinatorAdminAmt " +
                  "FROM event_all e, event_wc w " +
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

/*********************************************************
 *
 * Insert a new event for WC
 *
 ********************************************************/
function setNewEventInDB(newEvent, callback) {
  var queryDB = "INSERT INTO event_all (seasonID, venueID, eventDateTime, Title, " +
                                    "compensated, location, venueBonus, estimatedCheck, estimatedProfit, " +
                                    "actualCheck, payout, discrepancy, actualProfit, tacPct, " +
                                    "tacCut, drCut, eventNotes, closed, eventcol) " +
                        "VALUES   (?, 2, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0)";
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
      setNewWcEventInDB(results.insertId, newEvent, callback);
    }
  });
}

function setNewWcEventInDB(id, newEvent, callback) {
  var queryDB = " INSERT INTO event_wc (eventID, shuttleBonusAmount, creditCardTips, totalSales, " +
                                        "maxCreditCardTipAmount, coordinatorAdminAmt) " +
                        "VALUES (" + id + ", ?, ?, ?, ?, ? )";

  console.log("queryDB: " + queryDB);
  var params = [
    newEvent.shuttleBonusAmount,
    newEvent.creditCardTips,
    newEvent.maxCreditCardTipAmount,
    newEvent.coordinatorAdminAmt,
    newEvent.totalSalesWc
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
 * Edit an event for WC
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
      editWcEventinDB(editEvent, callback);
    }
  });
}

function editWcEventinDB(editEvent, callback) {
  var queryDB = "UPDATE event_wc " +
                "SET shuttleBonusAmount = ?, creditCardTips = ?, totalSales = ?, " +
                    "maxCreditCardTipAmount = ?, coordinatorAdminAmt = ? " +
                "WHERE eventID = ?";
  var params = [
    editEvent.shuttleBonusAmount,
    editEvent.creditCardTips,
    editEvent.maxCreditCardTipAmount,
    editEvent.totalSalesWc,
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
 * Delete an event for WC
 *
 ********************************************************/
function deleteWcEventFromDB(eventID, callback) {
  var queryDB = "DELETE FROM event_wc WHERE eventID = ?";
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
 * Get season contract for WC
 *
 ********************************************************/
function getContractWcFromDB(seasonID, callback) {
  var queryDB = "SELECT idcontract_wc, seasonID, wcFoodCommission, " +
                "wcAlcoholCommission, wcMaxCreditCardTipAmountDefault, " +
                "wcShuttleBonusAmountDefault " +
                "FROM contract_wc " +
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

function getWcJobsFromDB(callback) {
  var queryDB = "SELECT idjobs AS jobID, jobName, hourlyRate, isGuarantee, minutesBeforeOpen, venuePay " +
                "FROM jobs " +
                "WHERE venueID = 2";

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
  getAllWcEventsFromDB: getAllWcEventsFromDB,
  setNewEventInDB: setNewEventInDB,
  editEventinDB: editEventinDB,
  deleteWcEventFromDB: deleteWcEventFromDB,
  getContractWcFromDB: getContractWcFromDB,
  getWcJobsFromDB: getWcJobsFromDB
}

