var pool = require('../database/db');

function getAllCfStaffFromDB(callback) {
  var queryDB = "SELECT per.idperson, per.firstName, per.lastName, " +
                        "CONCAT(per.lastName, ', ', per.firstName) AS Name, " +
                        "per.email AS Email, per.phone AS Phone, " +  
                        "tu.accountName, " +
                        "CASE WHEN perpar.participationID = 1 " +
                            "THEN 1 " +
                            "END AS 'cfActive', "+
                        "CASE WHEN perpar.participationID = 2 " +
                            "THEN 1 " +
                            "END AS 'cfInactive', " +
                        "CASE WHEN perpar.participationID = 3 " +
                            "THEN 1 " +
                            "END AS 'cfInterested', " +
                        "percf.cfAlcoholTraining " +
                    "FROM person per, tu_account tu, person_participation perpar, person_cf_paperwork percf " +
                    "WHERE per.isTeamMember = 1 " +
                    "AND idtu_account = per.tuAccountID " +
                    "AND perpar.personID = per.idperson " +
                    "AND perpar.venueID = 3 " +
                    "AND percf.personID = per.idperson;"
                    

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

function getActiveCfStaffFromDB(callback) {
  var queryDB = "SELECT per.idperson, per.firstName, per.lastName, " +
                        "CONCAT(per.lastName, ', ', per.firstName) AS Name, " +
                        "per.email AS Email, per.phone As Phone, " + 
                        "tu.accountName, " +
                        "percf.cfAlcoholTraining " +
                    "FROM person per, tu_account tu, person_participation perpar, person_cf_paperwork percf " +
                    "WHERE per.isTeamMember = 1 " +
                    "AND idtu_account = per.tuAccountID " +
                    "AND perpar.personID = per.idperson " +
                    "AND perpar.venueID = 1 " +
                    "AND percf.personID = per.idperson " + 
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
  getAllCfStaffFromDB: getAllCfStaffFromDB,
  getActiveCfStaffFromDB: getActiveCfStaffFromDB
}