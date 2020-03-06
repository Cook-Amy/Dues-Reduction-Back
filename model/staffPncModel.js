var pool = require('../database/db');

function getAllPncStaffFromDB(callback) {
  var queryDB = "SELECT per.idperson, per.firstName, per.lastName, " +
                        "CONCAT(per.lastName, ', ', per.firstName) AS Name, " +
                        "per.email AS Email, per.phone As Phone, " + 
                        "tu.accountName, " +
                        "CASE WHEN perpar.participationID = 1 " +
                            "THEN 1 " +
                            "END AS 'pncActive', "+
                        "CASE WHEN perpar.participationID = 2 " +
                            "THEN 1 " +
                            "END AS 'pncInactive', " +
                        "CASE WHEN perpar.participationID = 3 " +
                            "THEN 1 " +
                            "END AS 'pncInterested', " +
                        "perpnc.pncHealthForm, perpnc.pncExperienced, perpnc.pncBars, perpnc.pncWaiver " +
                    "FROM person per, tu_account tu, person_participation perpar, person_pnc_paperwork perpnc " +
                    "WHERE per.isTeamMember = 1 " +
                    "AND idtu_account = per.tuAccountID " +
                    "AND perpar.personID = per.idperson " +
                    "AND perpar.venueID = 1 " +
                    "AND perpnc.personID = per.idperson";
                    

  pool.query(queryDB, (error, results) => {
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

function getActivePncStaffFromDB(callback) {
  var queryDB = "SELECT per.idperson, per.firstName, per.lastName, " +
                        "CONCAT(per.lastName, ', ', per.firstName) AS Name, " +
                        "per.email AS Email, per.phone As Phone, " + 
                        "tu.accountName, " +
                        "perpnc.pncHealthForm, perpnc.pncExperienced, perpnc.pncBars, perpnc.pncWaiver " +
                    "FROM person per, tu_account tu, person_participation perpar, person_pnc_paperwork perpnc " +
                    "WHERE per.isTeamMember = 1 " +
                    "AND idtu_account = per.tuAccountID " +
                    "AND perpar.personID = per.idperson " +
                    "AND perpar.venueID = 1 " +
                    "AND perpnc.personID = per.idperson " + 
                    "AND perpar.participationID = 1";
                    

  pool.query(queryDB, (error, results) => {
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

module.exports = {
  getAllPncStaffFromDB: getAllPncStaffFromDB,
  getActivePncStaffFromDB: getActivePncStaffFromDB
}