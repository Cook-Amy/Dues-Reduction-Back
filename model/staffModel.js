var pool = require('../database/db');

/***********************************************************************
 * GET ALL STAFF
 **********************************************************************/
function getAllStaffFromDB(callback) {
  var queryDB = "SELECT per.idperson, per.firstName, per.lastName, " +
                        "CONCAT(per.lastName, ', ', per.firstName) AS Name, " +
                        "per.email AS Email, per.phone As Phone, " + 
                        "tu.accountName AS tuAccount, " +
                        "MAX(CASE WHEN perpar.participationID = 1 AND perpar.venueID = 1 THEN 1 ELSE NULL END) 'pncActive', " +
                        "MAX(CASE WHEN perpar.participationID = 2 AND perpar.venueID = 1 THEN 1 ELSE NULL END) 'pncInactive', " +
                        "MAX(CASE WHEN perpar.participationID = 3 AND perpar.venueID = 1 THEN 1 ELSE NULL END) 'pncInterested', " +
                        "MAX(CASE WHEN perpar.participationID = 1 AND perpar.venueID = 2 THEN 1 ELSE NULL END) 'wcActive', " +
                        "MAX(CASE WHEN perpar.participationID = 2 AND perpar.venueID = 2 THEN 1 ELSE NULL END) 'wcInactive', " +
                        "MAX(CASE WHEN perpar.participationID = 3 AND perpar.venueID = 2 THEN 1 ELSE NULL END) 'wcInterested', " +
                        "MAX(CASE WHEN perpar.participationID = 1 AND perpar.venueID = 3 THEN 1 ELSE NULL END) 'cfActive', " +
                        "MAX(CASE WHEN perpar.participationID = 2 AND perpar.venueID = 3 THEN 1 ELSE NULL END) 'cfInactive', " +
                        "MAX(CASE WHEN perpar.participationID = 3 AND perpar.venueID = 3 THEN 1 ELSE NULL END) 'cfInterested', " +
                        "perpnc.pncHealthForm, perpnc.pncExperienced, perpnc.pncBars, perpnc.pncBarsRefresher, perpnc.pncWaiver, " +
                        "perwc.wcTeamTraining, percf.cfAlcoholTraining " +
                    "FROM person per, tu_account tu, person_participation perpar, person_pnc_paperwork perpnc, person_wc_paperwork perwc, person_cf_paperwork percf " +
                    "WHERE per.isTeamMember = 1 " +
                    "AND idtu_account = per.tuAccountID " +
                    "AND perpar.personID = per.idperson " +
                    "AND perpnc.personID = per.idperson " +
                    "AND perwc.personID = per.idperson " +
                    "AND percf.personID = per.idperson " +
                    "GROUP BY per.idperson";
                    

  pool.query(queryDB, (error, results) => {
    if(error) {
      console.log("Error getting results from DB: ");
      console.log(error);
    }
    else if(results.length == 0) {
      console.log("Staff not found in DB");
      callback(null, results, null);
    }
    else {
      getAllTrainingFromDB(results, callback);
    }
  });
}

function getAllTrainingFromDB(allStaff, callback) {
  var queryDB = "SELECT pt.personID, j.jobName, j.idjobs " +
                "FROM person_training pt, jobs j " +
                "WHERE pt.jobID = j.idjobs " +
                "AND pt.isFullyTrained = 1";
        
  pool.query(queryDB, (error, results) => {
    if(error) {
      console.log("Error getting results from DB: ");
      console.log(error);
    }
    else {
      callback(error, allStaff, results);
    }
  });
}


/***********************************************************************
 * GET STAFF FOR EVENT
 **********************************************************************/
function getStaffForEventFromDB(eventID, callback) {
  var queryDB = "SELECT per.idperson, CONCAT(per.lastName, ', ', per.firstName) AS Name, j.jobName, t.scheduledArrivalTime, " +
                                            "ppp.pncExperienced, ppp.pncBars, ppp.pncHealthForm, ppp.pncWaiver, ppp.pncBarsRefresher " +
                    "FROM person per, person_pnc_paperwork ppp, timesheet t, jobs j " +
                    "WHERE t.eventID = ? " +
                    "AND t.personID = per.idperson " +
                    "AND t.personID = ppp.personID " +
                    "AND t.jobID = j.idjobs";

  var params = [eventID];

  pool.query(queryDB, params, (error, results) => {
    if(error) {
      console.log("Error getting results from DB: ");
      console.log(error);
    }
    else if(results.length == 0) {
      console.log("Staff not found in DB");
      callback(null, results);
    }
    else {
      callback(null, results);
    }
  });
}


/***********************************************************************
 * ADD STAFF
 **********************************************************************/
function addOneStaffToDB(newStaff, callback) {
  var queryDB = "INSERT INTO tu_account (accountName) " +
                "SELECT ? " +
                "FROM DUAL WHERE NOT EXISTS (" +
                  "SELECT idtu_account " +
                  "FROM tu_account " +
                  "WHERE accountName = ?); " +
                "SELECT idtu_account AS tuAccountID " +
                "FROM tu_account " + 
                "WHERE accountName = ?; ";
  var params = [
    newStaff.tuAccount,
    newStaff.tuAccount,
    newStaff.tuAccount
  ]

  pool.query(queryDB, params, (error, results) => {
    if(error) {
      console.log("Error getting results from DB: ");
      console.log(error);
    }
    else {
      addStaffToDB2(newStaff, results[1][0].tuAccountID, callback);
    }
  });  
}

function addStaffToDB2(newStaff, id, callback) {
  var queryDB = "INSERT INTO person (tuAccountID, firstName, lastName, email, phone, isTeamMember) " +
                "VALUES (" + id + ", ?, ?, ?, ?, 1) ";
  var params = [
    newStaff.firstName,
    newStaff.lastName,
    newStaff.Email,
    newStaff.Phone
  ];

  pool.query(queryDB, params, (error, results) => {
    if(error) {
      console.log("Error getting results from DB: ");
      console.log(error);
    }
    else {
      addParticipationToDB(newStaff, results.insertId, callback);
    }
  }); 
}

function addParticipationToDB(newStaff, id, callback) {
  var queryDB = "INSERT INTO person_participation (personID, venueID, participationID) " +
                "VALUES (" + id + ", 1, ?); " +
                "INSERT INTO person_participation (personID, venueID, participationID) " +
                "VALUES (" + id + ", 2, ?); " +
                "INSERT INTO person_participation (personID, venueID, participationID) " +
                "VALUES (" + id + ", 3, ?) ";

  var params = [];

  if(newStaff.pncActive) {
    params.push(1);
  }
  else if(newStaff.pncInactive) {
    params.push(2);
  }
  else if(newStaff.pncInterested) {
    params.push(3);
  }
  if(newStaff.wcActive) {
    params.push(1);
  }
  else if(newStaff.wcInactive) {
    params.push(2);
  }
  else if(newStaff.wcInterested) {
    params.push(3);
  }
  if(newStaff.cfActive) {
    params.push(1);
  }
  else if(newStaff.cfInactive) {
    params.push(2);
  }
  else if(newStaff.cfInterested) {
    params.push(3);
  }

  pool.query(queryDB, params, (error, results) => {
    if(error) {
      console.log("Error getting results from DB: ");
      console.log(error);
    }
    else {
      addPaperworkToDB(newStaff, id, callback);
    }
  }); 
}

function addPaperworkToDB(newStaff, id, callback) {
  var queryDB = "INSERT INTO person_pnc_paperwork (personID, pncHealthForm, pncExperienced, " +  
                    "pncBars, pncBarsRefresher, pncWaiver) " +
                  "VALUES (" + id + ", ?, ?, ?, ?, ?); " +
                "INSERT INTO person_wc_paperwork (personID, wcTeamTraining) " +
                  "VALUES (" + id + ", ?); " +
                "INSERT INTO person_cf_paperwork (personID, cfAlcoholTraining) " +
                  "VALUES (" + id + ", ?); ";

  var barsDate = new Date().toISOString();
  if(newStaff.pncBars == null) {
    barsDate = null;
  }
  else {
    barsDate = new Date(newStaff.pncBars).toISOString();
  }
  var teamTraining = new Date().toISOString();
  if(newStaff.wcTeamTraining == null) {
    teamTraining = null;
  }
  else {
    teamTraining = new Date(newStaff.wcTeamTraining).toISOString();
  }
  var alcTraining = new Date().toISOString();
  if(newStaff.cfAlcoholTraining == null) {
    alcTraining = null;
  }
  else {
    alcTraining = new Date(newStaff.cfAlcoholTraining).toISOString();
  }


  var params = [
    newStaff.pncHealthForm,
    newStaff.pncExperienced,
    barsDate,
    newStaff.barsRefresher,
    newStaff.pncWaiver,
    teamTraining,
    alcTraining
  ];

  pool.query(queryDB, params, (error, results) => {
    if(error) {
      console.log("Error getting results from DB: ");
      console.log(error);
    }
    else {
      callback(error, results, id);
    }
  }); 
}


/***********************************************************************
 * UPDATE STAFF
 **********************************************************************/
function updateOneStaffInDB(newStaff, callback) {
  var queryDB = "INSERT INTO tu_account (accountName) " +
                "SELECT ? " +
                "FROM DUAL WHERE NOT EXISTS (" +
                  "SELECT idtu_account " +
                  "FROM tu_account " +
                  "WHERE accountName = ?); " +
                "SELECT idtu_account AS tuAccountID " +
                "FROM tu_account " + 
                "WHERE accountName = ?; ";
  var params = [
    newStaff.tuAccount,
    newStaff.tuAccount,
    newStaff.tuAccount
  ]

  pool.query(queryDB, params, (error, results) => {
    if(error) {
      console.log("Error getting results from DB: ");
      console.log(error);
    }
    else {
      updateOnePersonInDB(newStaff, results[1][0].tuAccountID, callback);
    }
  }); 
}

function updateOnePersonInDB(newStaff, resultID, callback) {
  var queryDB = "UPDATE person " +
                "SET tuAccountID = ?, firstName = ?, lastName = ?, email = ?, phone = ? "+
                "WHERE idperson = ?";
  var params = [
    resultID,
    newStaff.firstName,
    newStaff.lastName,
    newStaff.Email,
    newStaff.Phone,
    newStaff.idperson
  ]

  pool.query(queryDB, params, (error, results) => {
    if(error) {
      console.log("Error getting results from DB: ");
      console.log(error);
    }
    else {
      updateParticipationInDB(newStaff, callback);
    }
  });
}

function updateParticipationInDB(newStaff, callback) {
  var queryDB = "UPDATE person_participation " +
                "SET participationID = ? " +
                "WHERE personID = ? AND venueID = 1; " +
                "UPDATE person_participation " +
                "SET participationID = ? " +
                "WHERE personID = ? AND venueID = 2; " +
                "UPDATE person_participation " +
                "SET participationID = ? " +
                "WHERE personID = ? AND venueID = 3; ";
  var params = [];

  if(newStaff.pncActive) {
    params.push(1);
  }
  else if(newStaff.pncInactive) {
    params.push(2);
  }
  else if(newStaff.pncInterested) {
    params.push(3);
  }
  params.push(newStaff.idperson);

  if(newStaff.wcActive) {
    params.push(1);
  }
  else if(newStaff.wcInactive) {
    params.push(2);
  }
  else if(newStaff.wcInterested) {
    params.push(3);
  }
  params.push(newStaff.idperson);

  if(newStaff.cfActive) {
    params.push(1);
  }
  else if(newStaff.cfInactive) {
    params.push(2);
  }
  else if(newStaff.cfInterested) {
    params.push(3);
  }
  params.push(newStaff.idperson);

  pool.query(queryDB, params, (error, results) => {
    if(error) {
      console.log("Error getting results from DB: ");
      console.log(error);
    }
    else {
      updatePaperworkInDB(newStaff, callback);
    }
  });
}

function updatePaperworkInDB(newStaff, callback) {
  var queryDB = "UPDATE person_pnc_paperwork " + 
                "SET pncHealthForm = ?, pncExperienced = ?, pncBars = ?, " +
                  "pncBarsRefresher = ?, pncWaiver = ? " +
                "WHERE personID = ?; " +
                "UPDATE person_wc_paperwork " + 
                "SET wcTeamTraining = ? " +
                "WHERE personID = ?; " +
                "UPDATE person_cf_paperwork " + 
                "SET cfAlcoholTraining = ? " +
                "WHERE personID = ?; ";
  var barsDate = new Date(newStaff.pncBars).toISOString();
  var teamTraining = new Date(newStaff.wcTeamTraining).toISOString();
  var alcTraining = new Date(newStaff.cfAlcoholTraining).toISOString();
  var params = [
    newStaff.pncHealthForm,
    newStaff.pncExperienced,
    barsDate,
    newStaff.barsRefresher,
    newStaff.pncWaiver,
    newStaff.idperson,
    teamTraining,
    newStaff.idperson,
    alcTraining,
    newStaff.idperson
  ];

  pool.query(queryDB, params, (error, results) => {
    if(error) {
      console.log("Error getting results from DB: ");
      console.log(error);
    }
    else {
      updateJobTrainingInDB(newStaff, callback);
    }
  });
}

function updateJobTrainingInDB(newStaff, callback) {
  var queryDB = "";
  var params = [];
  var job = [1, 2, 4, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 19];

  var isTrained = [
    newStaff.wcStandLeader,
    newStaff.wcMoveStockOut,
    newStaff.pncStandLeader,
    newStaff.pncGroupLeader,
    newStaff.pncHeadCook,
    newStaff.pncRegister,
    newStaff.wcFinalStandPrep,
    newStaff.wcSales,
    newStaff.pncAssistantCook,
    newStaff.wcContainerBarLead,
    newStaff.cfLeader,
    newStaff.cfStaff,
    newStaff.pncBeerCart,
    newStaff.cfAssistantLeader 
  ];
  
  for(var j = 0; j < job.length; j++) {
    queryDB += "INSERT INTO person_training (personID, jobID, trainingBeginDate, trainingLastDate, isFullyTrained) " +
                "SELECT  ?, ?, null, null, ? " +
                "FROM DUAL WHERE NOT EXISTS ( " +
                  "SELECT idperson_training " +
                  "FROM person_training " +
                  "WHERE personID = ? AND jobID = ?); " +
                "UPDATE person_training " +
                "SET isFullyTrained = ? " +
                "WHERE  personID = ? AND jobID = ?; ";
    var personID = newStaff.idperson;
    var jobID = job[j];
    var isFullyTrained = isTrained[j];
    params.push(personID);
    params.push(jobID);
    params.push(isFullyTrained);
    params.push(personID);
    params.push(jobID);
    params.push(isFullyTrained);
    params.push(personID);
    params.push(jobID);
  }
  

  pool.query(queryDB, params, (error, results) => {
    if(error) {
      console.log("Error getting results from DB: ");
      console.log(error);
    }
    else {
      callback(null, results);
    }
  });
}


/***********************************************************************
 * REMOVE STAFF
 **********************************************************************/
function removeStaffinDB(staff, callback) {

  var queryDB = "UPDATE person SET isTeamMember = 0 WHERE idperson = ?";
  var params = [staff.idperson];

  pool.query(queryDB, params, (error, results) => {
    if(error) {
      console.log("Error getting results from DB: ");
      console.log(error);
    }
    else {
      callback(error, results);
    }
  });
}


/***********************************************************************
 * TU Accounts
 **********************************************************************/
function getAllTuAccountsFromDB(callback) {
  var queryDB = "SELECT accountName FROM tu_account";

  pool.query(queryDB, (error, results) => {
    if(error) {
      console.log("Error getting results from DB: ");
      console.log(error);
    }
    else {
      callback(error, results);
    }
  });
}

module.exports = {
  getAllStaffFromDB: getAllStaffFromDB,
  getStaffForEventFromDB: getStaffForEventFromDB,
  addOneStaffToDB: addOneStaffToDB,
  updateOneStaffInDB: updateOneStaffInDB,
  removeStaffinDB: removeStaffinDB,
  getAllTuAccountsFromDB: getAllTuAccountsFromDB
}