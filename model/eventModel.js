var pool = require('../database/db');

/*********************************************************
 * 
 * Get all events
 * 
 ********************************************************/
function getEventsFromDB (seasonID, callback) {
  var queryDB = "";
  var params = [];

  if(seasonID == 999) {
    queryDB = "SELECT e.idevent, e.seasonID, e.venueID, e.eventDateTime AS Date, e.Title, e.compensated, e.location, " + 
                    "e.venueBonus, e.estimatedCheck, e.estimatedProfit, e.actualCheck, e.payout, " + 
                    "e.discrepancy, e.actualProfit, e.tacPct, e.tacCut, e.drCut, e.eventNotes, " +  
                    "e.closed, e.coordinatorAdminAmt, " +
                    "p.totalSales AS totalSalesPnc, p.metCommissionBonus, p.guarantee, p.alcSales, p.totalDiscounts, p.eventCountsTowardsTotal, " +
                    "p.itemSales1, p.alcSales1, p.discounts1, p.itemSales2, p.alcSales2, p.discounts2, " +
                    "p.itemSales3, p.alcSales3, p.discounts3, p.itemSales4, p.alcSales4, p.discounts4, " +
                    "p.itemSales5, p.alcSales5, p.discounts5, p.itemSales6, p.alcSales6, p.discounts6 " +
                  "FROM event_all e, event_pnc p " + 
                  "WHERE e.idevent = p.eventID ";
  }
  else {
    queryDB = "SELECT e.idevent, e.seasonID, e.venueID, e.eventDateTime AS Date, e.Title, e.compensated, e.location, " + 
                    "e.venueBonus, e.estimatedCheck, e.estimatedProfit, e.actualCheck, e.payout, " + 
                    "e.discrepancy, e.actualProfit, e.tacPct, e.tacCut, e.drCut, e.eventNotes, " +  
                    "e.closed, e.coordinatorAdminAmt, " +
                    "p.totalSales AS totalSalesPnc, p.metCommissionBonus, p.guarantee, p.alcSales, p.totalDiscounts, p.eventCountsTowardsTotal, " +
                    "p.itemSales1, p.alcSales1, p.discounts1, p.itemSales2, p.alcSales2, p.discounts2, " +
                    "p.itemSales3, p.alcSales3, p.discounts3, p.itemSales4, p.alcSales4, p.discounts4, " +
                    "p.itemSales5, p.alcSales5, p.discounts5, p.itemSales6, p.alcSales6, p.discounts6 " +
                  "FROM event_all e, event_pnc p " + 
                  "WHERE e.idevent = p.eventID " +
                  "AND e.seasonID = ?";
    params.push(seasonID);
  }

  pool.query(queryDB, params, (error, results) => {
    if(error) {
      console.log("Error getting results from DB: ");
      console.log(error);
    }
    else {
      getEventsFromDB2(results, seasonID, callback);
    }
  });
}

function getEventsFromDB2 (pncEvent, seasonID, callback) {
  var queryDB = "";
  var params = [];
  
  if(seasonID == 999) {
    queryDB = "SELECT e.idevent, e.seasonID, e.venueID, e.eventDateTime AS Date, e.Title, e.compensated, e.location, " + 
                    "e.venueBonus, e.estimatedCheck, e.estimatedProfit, e.actualCheck, e.payout, " + 
                    "e.discrepancy, e.actualProfit, e.tacPct, e.tacCut, e.drCut, e.eventNotes, " +  
                    "e.closed, e.coordinatorAdminAmt, " +
                    "w.creditCardTips, w.maxCreditCardTipAmount, w.shuttleBonusAmount " +
                  "FROM event_all e, event_wc w " + 
                  "WHERE e.idevent = w.eventID ";
  }
  else {
    queryDB = "SELECT e.idevent, e.seasonID, e.venueID, e.eventDateTime AS Date, e.Title, e.compensated, e.location, " + 
                    "e.venueBonus, e.estimatedCheck, e.estimatedProfit, e.actualCheck, e.payout, " + 
                    "e.discrepancy, e.actualProfit, e.tacPct, e.tacCut, e.drCut, e.eventNotes, " +  
                    "e.closed, e.coordinatorAdminAmt, " +
                    "w.creditCardTips, w.maxCreditCardTipAmount, w.shuttleBonusAmount " +
                  "FROM event_all e, event_wc w " + 
                  "WHERE e.idevent = w.eventID " + 
                  "AND e.seasonID = ?";
    params.push(seasonID);
  }

  pool.query(queryDB, params, (error, results) => {
    if(error) {
      console.log("Error getting results from DB: ");
      console.log(error);
    }
    else {
      let eventResults = pncEvent.concat(results);
      getEventsFromDB3(eventResults, seasonID, callback);
    }
  });
}

function getEventsFromDB3 (eventResults, seasonID, callback) {
  var queryDB = "";
  var params = [];
  
  if(seasonID == 999){
    queryDB = "SELECT e.idevent, e.seasonID, e.venueID, e.eventDateTime AS Date, e.Title, e.compensated, e.location, " + 
                "e.venueBonus, e.estimatedCheck, e.estimatedProfit, e.actualCheck, e.payout, " + 
                "e.discrepancy, e.actualProfit, e.tacPct, e.tacCut, e.drCut, e.eventNotes, " +  
                "e.closed, e.coordinatorAdminAmt, " +
                "c.totalSales AS totalSalesCf, c.shuttleBonusAmount, c.shuttleLocation " +
              "FROM event_all e, event_cf c " + 
              "WHERE e.idevent = c.eventID ";
  }
  else {
    queryDB = "SELECT e.idevent, e.seasonID, e.venueID, e.eventDateTime AS Date, e.Title, e.compensated, e.location, " + 
                "e.venueBonus, e.estimatedCheck, e.estimatedProfit, e.actualCheck, e.payout, " + 
                "e.discrepancy, e.actualProfit, e.tacPct, e.tacCut, e.drCut, e.eventNotes, " +  
                "e.closed, e.coordinatorAdminAmt, " +
                "c.totalSales AS totalSalesCf, c.shuttleBonusAmount, c.shuttleLocation " +
              "FROM event_all e, event_cf c " + 
              "WHERE e.idevent = c.eventID " +
              "AND e.seasonID = ?";
  params.push(seasonID);
  }

  pool.query(queryDB, params, (error, results) => {
    if(error) {
      console.log("Error getting results from DB: ");
      console.log(error);
    }
    else if(results.length == 0 && eventResults.length == 0) {
      console.log("Events not found in DB");
      callback(null, results);
    }
    else {
      let events = eventResults.concat(results);
      callback(null, events);
    }
  });
}


/*********************************************************
 * 
 * Delete an event
 * 
 ********************************************************/
function deleteOneEventFromDB(eventID, callback) {
  var queryDB = "DELETE FROM event_pnc WHERE eventID = ?; " +
                "DELETE FROM event_wc WHERE eventID = ?; " +
                "DELETE FROM event_cf WHERE eventID = ?; ";
  var params = [eventID, eventID, eventID];

  pool.query(queryDB, params, (error, results) => {
    if(error) {
      console.log("Error setting new event into DB: ");
      console.log(error);
    }
    else {
      deleteTimesheetsForEventFromDB(eventID, callback);
    }
  });
}

function deleteTimesheetsForEventFromDB(eventID, callback) {
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
 * Edit an event
 * 
 ********************************************************/
function editOneEventinDB(event, eventID, callback) {
  var queryDB = "UPDATE event_all " +
                "SET eventDateTime = ?, Title = ?, compensated = ?, location = ?, " +
                    "venueBonus = ?, estimatedCheck = ?, estimatedProfit = ?, actualCheck = ?, " +
                    "payout = ?, discrepancy = ?, actualProfit = ?, tacPct = ?, " +
                    "tacCut = ?, drCut = ?, eventNotes = ?, closed = ?, coordinatorAdminAmt = ? " +
                "WHERE idevent = ?";

  var newDate = new Date(event.Date).toISOString();

  var params = [
    newDate,
    event.Title,
    event.compensated,
    event.location,
    event.venueBonus,
    event.estimatedCheck,
    event.estimatedProfit,
    event.actualCheck,
    event.payout,
    event.discrepancy,
    event.actualProfit,
    event.tacPct,
    event.tacCut,
    event.drCut,
    event.eventNotes,
    event.closed,
    event.coordinatorAdminAmt,
    event.idevent
  ];

  pool.query(queryDB, params, (error, results) => {
    if(error) {
      console.log("Error setting new event into DB: ");
      console.log(error);
    }
    else {
      editVenueEventinDB(event, eventID, callback);
    }
  });
}

function editVenueEventinDB(event, eventID, callback) {
  var queryDB = "";
  var params = [];

  if(eventID == 1) {
    queryDB = "UPDATE event_pnc " +
                "SET totalSales = ?, metCommissionBonus = ?, guarantee = ?, " +
                     "alcSales = ?, eventCountsTowardsTotal = ?, totalDiscounts = ?, " + 
                     "itemSales1 = ?, alcSales1 = ?, discounts1 = ?, " +
                     "itemSales2 = ?, alcSales2 = ?, discounts2 = ?, " +
                     "itemSales3 = ?, alcSales3 = ?, discounts3 = ?, " +
                     "itemSales4 = ?, alcSales4 = ?, discounts4 = ?, " +
                     "itemSales5 = ?, alcSales5 = ?, discounts5 = ?, " +
                     "itemSales6 = ?, alcSales6 = ?, discounts6 = ? " +
                "WHERE eventID = ? ";
  
    params.push(event.totalSalesPnc),
    params.push(event.metCommissionBonus),
    params.push(event.guarantee),
    params.push(event.alcSales),
    params.push(event.eventCountsTowardsTotal),
    params.push(event.totalDiscounts),
    params.push(event.itemSales1),
    params.push(event.alcSales1),
    params.push(event.discounts1),
    params.push(event.itemSales2),
    params.push(event.alcSales2),
    params.push(event.discounts2),
    params.push(event.itemSales3),
    params.push(event.alcSales3),
    params.push(event.discounts3),
    params.push(event.itemSales4),
    params.push(event.alcSales4),
    params.push(event.discounts4),
    params.push(event.itemSales5),
    params.push(event.alcSales5),
    params.push(event.discounts5),
    params.push(event.itemSales6),
    params.push(event.alcSales6),
    params.push(event.discounts6),
    params.push(event.idevent)
  }
  else if(eventID == 2) {
    var shuttleAmount = 0;
    if(event.shuttleBonusAmountWc) {
      shuttleAmount = event.shuttleBonusAmountWc;
    }

    queryDB = "UPDATE event_wc " +
              "SET creditCardTips = ?, maxCreditCardTipAmount = ?, " +
                  "shuttleBonusAmount = ? " +
              "WHERE eventID = ? ";

    params.push(event.creditCardTips),
    params.push(event.maxCreditCardTipAmount),
    params.push(shuttleAmount),
    params.push(event.idevent)
  }
  else if(eventID == 3) {
    var shuttleAmount = 0;
    if(event.shuttleBonusAmountCf) {
      shuttleAmount = event.shuttleBonusAmountCf;
    }
    var queryDB = "UPDATE event_cf " +
                  "SET totalSales = ?,  " +
                      "shuttleBonusAmount = ?, shuttleLocation = ? " +
                  "WHERE eventID = ?;";

    params.push(event.totalSalesCf),
    params.push(shuttleAmount),
    params.push(''),
    params.push(event.idevent)
  }  

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
 * Insert a new event
 * 
 ********************************************************/
function setNewEventInDB(newEvent, callback) {
  var queryDB = "INSERT INTO event_all (seasonID, venueID, eventDateTime, Title, " +
                                    "compensated, location, venueBonus, estimatedCheck, estimatedProfit, " +
                                    "actualCheck, payout, discrepancy, actualProfit, tacPct, " +
                                    "tacCut, drCut, eventNotes, closed, coordinatorAdminAmt) " +
                        "VALUES   (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
  
  var newDate = new Date(newEvent.Date).toISOString();

   var params = [
    newEvent.seasonID,
    newEvent.venueID,
    newDate,
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
    newEvent.closed,
    newEvent.coordinatorAdminAmt
  ];

  pool.query(queryDB, params, (error, results) => {
    if(error) {
      console.log("Error setting new event into DB: ");
      console.log(error);
    }
    else {
      setNewVenueEventInDB(results.insertId, newEvent, callback);
    }
  });
}

function setNewVenueEventInDB(id, newEvent, callback) {
  var queryDB = "";
  var params = [];
  if(newEvent.venueID == 1) {
    queryDB = " INSERT INTO event_pnc (eventID, metCommissionBonus, guarantee, totalSales, " +
                          "alcSales, eventCountsTowardsTotal, coordinatorAdminAmt, totalDiscounts, " +
                          "itemSales1, alcSales1, discounts1, itemSales2, alcSales2, discounts2, " +
                          "itemSales3, alcSales3, discounts3, itemSales4, alcSales4, discounts4, " +
                          "itemSales5, alcSales5, discounts5, itemsSales6, alcSales6, discounts6) " +
                "VALUES (" + id + ", ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ? )";

    params.push(newEvent.metCommissionBonus);
    params.push(newEvent.guarantee);
    params.push(newEvent.totalSalesPnc);
    params.push(newEvent.alcSales);
    params.push(newEvent.eventCountsTowardsTotal);
    params.push(newEvent.coordinatorAdminAmt);
    params.push(newEvent.totalDiscounts);
    params.push(newEvent.itemsSales1);
    params.push(newEvent.alcSales1);
    params.push(newEvent.discounts1);
    params.push(newEvent.itemsSales2);
    params.push(newEvent.alcSales2);
    params.push(newEvent.discounts2);
    params.push(newEvent.itemsSales3);
    params.push(newEvent.alcSales3);
    params.push(newEvent.discounts3);
    params.push(newEvent.itemsSales4);
    params.push(newEvent.alcSales4);
    params.push(newEvent.discounts4);
    params.push(newEvent.itemsSales5);
    params.push(newEvent.alcSales5);
    params.push(newEvent.discounts5);
    params.push(newEvent.itemsSales6);
    params.push(newEvent.alcSales6);
    params.push(newEvent.discounts6);
  }

  else if(newEvent.venueID == 2) {
    var shuttleAmount = 0;
    if(newEvent.shuttleBonusAmountWc) {
      shuttleAmount = newEvent.shuttleBonusAmountWc;
    }
    queryDB = " INSERT INTO event_wc (eventID, shuttleBonusAmount, creditCardTips, maxCreditCardTipAmount, coordinatorAdminAmt) " +
              "VALUES (" + id + ", ?, ?, ?, ? )";

    params.push(shuttleAmount);
    params.push(newEvent.creditCardTips);
    params.push(newEvent.maxCreditCardTipAmount);
    params.push(newEvent.coordinatorAdminAmt);
  }

  else if(newEvent.venueID == 3) {
    var shuttleAmount = 0;
    if(newEvent.shuttleBonusAmountCf) {
      shuttleAmount = newEvent.shuttleBonusAmountCf;
    }
    queryDB = " INSERT INTO event_cf (eventID, shuttleBonusAmount, shuttleLocation, totalSales, coordinatorAdminAmt) " +
                "VALUES (" + id + ", ?, ?, ?, ? )";

    params.push(shuttleAmount);
    params.push(newEvent.shuttleLocation);
    params.push(newEvent.totalSalesCf);
    params.push(newEvent.coordinatorAdminAmt);
  }

  pool.query(queryDB, params, (error, results) => {
    if(error) {
      console.log("Error setting new event into DB: ");
      console.log(error);
    }
    else {
      callback(null, id);
    }
  });
}


/*********************************************************
 * 
 * TIMESHEETS
 * 
 ********************************************************/
function getTimesheetForEventFromDB (eventID, callback) {
  var queryDB = "SELECT t.idtimesheet, p.firstName, p.lastName, t.personID, j.jobName, t.jobID, t.scheduledArrivalTime, t.hourlyRate, t.timeIn, t.timeOut, t.hoursWorked, t.shuttleBonus, t.eventBonus, t.hourlyBonus, t.creditCardTips, t.creditAmount, j.isGuarantee, j.venuePay, t.lastReminder " +
                "FROM timesheet t, person p, jobs j " +
                "WHERE t.eventID = ? " +
                "AND t.personID = p.idperson " +
                "AND t.jobID = j.idjobs";
  var params = [eventID];

  pool.query(queryDB, params, (error, results) => {
    if(error) {
      console.log("Error getting results from DB: ");
      console.log(error);
    }
    else if(results.length == 0) {
      console.log("Staff for event not found in DB");
      callback(null, results);
    }
    else {
      callback(null, results);
    }
  });
}

function updateTimesheetInDB(timesheet, callback) {
  var queryDB = "UPDATE timesheet " +
                "SET jobID = ?, scheduledArrivalTime = ?, hourlyRate = ?, " +
                    "timeIn = ?, timeOut = ?, hoursWorked = ?, " +
                    "shuttleBonus = ?, eventBonus = ?, hourlyBonus = ?, "+
                    "creditCardTips = ?, creditAmount = ? " +
                "WHERE idtimesheet = ?";
  var date = new Date(timesheet.scheduledArrivalTime).toISOString();

  var timeIn = null;
  var timeOut = null;
  if(timesheet.timeIn){
    timeIn = new Date(timesheet.timeIn).toISOString();
  }
  if(timesheet.timeOut) {
    timeOut = new Date(timesheet.timeOut).toISOString();
  }
  var params = [
    timesheet.jobID,
    date,
    timesheet.hourlyRate,
    timeIn,
    timeOut,
    timesheet.hoursWorked,
    timesheet.shuttleBonus,
    timesheet.eventBonus,
    timesheet.hourlyBonus,
    timesheet.creditCardTips,
    timesheet.creditAmount,
    timesheet.idtimesheet
  ];

  pool.query(queryDB, params, (error, results) => {
    if(error) {
      console.log("Error setting timesheet in DB: ");
      console.log(error);
    }
    else {
      callback(null, results);
    }
  });
}

function addTimesheetInDB(timesheet, eventID, callback) {
  var queryDB = "INSERT INTO timesheet " +
                  "(eventID, personID, jobID, " +
                  "scheduledArrivalTime, hourlyRate, timeIn, timeOut, " +
                  "hoursWorked, shuttleBonus, eventBonus, hourlyBonus, " +
                  "creditCardTips, creditAmount, lastReminder) " +
                "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, null)";
  var date = new Date(timesheet.scheduledArrivalTime).toISOString();
  var timeIn = null;
  var timeOut = null;
  if(timesheet.timeIn){
    timeIn = new Date(timesheet.timeIn).toISOString();
  }
  if(timesheet.timeOut) {
    timeOut = new Date(timesheet.timeOut).toISOString();
  }
  var params = [
    eventID,
    timesheet.personID,
    timesheet.jobID,
    date,
    timesheet.hourlyRate,
    timeIn,
    timeOut,
    timesheet.hoursWorked,
    timesheet.shuttleBonus,
    timesheet.eventBonus,
    timesheet.hourlyBonus,
    timesheet.creditCardTips,
    timesheet.creditAmount
  ];

  pool.query(queryDB, params, (error, results) => {
    if(error) {
      console.log("Error setting timesheet in DB: ");
      console.log(error);
    }
    else {
      callback(null, results.insertId);
    }
  });
}

function updateAllTimesheetsInDB(timesheets, callback) {
  var queryDB = "";
  var params = [];

  timesheets.forEach(ts => {
    queryDB += "UPDATE timesheet " +
                "SET jobID = ?, scheduledArrivalTime = ?, hourlyRate = ?, " +
                    "timeIn = ?, timeOut = ?, hoursWorked = ?, " +
                    "shuttleBonus = ?, eventBonus = ?, hourlyBonus = ?, "+
                    "creditCardTips = ?, creditAmount = ? " +
                "WHERE idtimesheet = ?; ";
    var date = new Date(ts.scheduledArrivalTime).toISOString();
    var timeIn = null;
    var timeOut = null;
    if(ts.timeIn){
      timeIn = new Date(ts.timeIn).toISOString();
    }
    if(ts.timeOut) {
      timeOut = new Date(ts.timeOut).toISOString();
    }
    params.push(
      ts.jobID,
      date,
      ts.hourlyRate,
      timeIn,
      timeOut,
      ts.hoursWorked,
      ts.shuttleBonus,
      ts.eventBonus,
      ts.hourlyBonus,
      ts.creditCardTips,
      ts.creditAmount,
      ts.idtimesheet
    );
  });

  pool.query(queryDB, params, (error, results) => {
    if(error) {
      console.log("Error setting timesheet in DB: ");
      console.log(error);
    }
    else {
      callback(null, results);
    }
  });
}

function deleteOneTimesheetInDB(id, callback) {
  var queryDB = "DELETE FROM timesheet WHERE idtimesheet = ?";
  var params = [id];

  pool.query(queryDB, params, (error, results) => {
    if(error) {
      console.log("Error setting timesheet in DB: ");
      console.log(error);
    }
    else {
      callback(null, results);
    }
  });
}

/*********************************************************
 * 
 * Get all events for calendar
 * 
 ********************************************************/
function getCalendarEventsFromDB (callback) {
  var queryDB = "SELECT idevent, venueID, eventDateTime AS date, Title AS title "+
                "FROM event_all";

  pool.query(queryDB, (error, results) => {
    if(error) {
      console.log("Error getting results from DB: ");
      console.log(error);
    }
    else {
      callback(null, results);
    }
  });
}

module.exports = {
  getEventsFromDB: getEventsFromDB,
  deleteOneEventFromDB: deleteOneEventFromDB,
  getTimesheetForEventFromDB: getTimesheetForEventFromDB,
  updateTimesheetInDB: updateTimesheetInDB,
  addTimesheetInDB: addTimesheetInDB,
  updateAllTimesheetsInDB: updateAllTimesheetsInDB,
  deleteOneTimesheetInDB: deleteOneTimesheetInDB,
  editOneEventinDB: editOneEventinDB,
  setNewEventInDB: setNewEventInDB,
  getCalendarEventsFromDB: getCalendarEventsFromDB
}