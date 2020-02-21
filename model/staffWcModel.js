var pool = require('../database/db');

function getAllWcStaffFromDB(callback) {
  var queryDB = "SELECT per.idperson, per.firstName, per.lastName, " +
                        "CONCAT(per.lastName, ', ', per.firstName) AS Name, " +
                        "per.email AS Email, per.phone AS Phone, " + 
                        "tu.accountName, " +
                        "CASE WHEN perpar.participationID = 1 " +
                            "THEN 1 " +
                            "END AS 'wcActive', "+
                        "CASE WHEN perpar.participationID = 2 " +
                            "THEN 1 " +
                            "END AS 'wcInactive', " +
                        "CASE WHEN perpar.participationID = 3 " +
                            "THEN 1 " +
                            "END AS 'wcInterested', " +
                        "perwc.wcTeamTraining " +
                    "FROM person per, tu_account tu, person_participation perpar, person_wc_paperwork perwc " +
                    "WHERE per.isTeamMember = 1 " +
                    "AND idtu_account = per.tuAccountID " +
                    "AND perpar.personID = per.idperson " +
                    "AND perpar.venueID = 2 " +
                    "AND perwc.personID = per.idperson;"
                    

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
      // console.log("Events found in DB: ");
      // console.log(results);
      // console.log("Results returned for WC staff: " + results.length);

      callback(null, results);
    }
  });
}

module.exports = {
  getAllWcStaffFromDB: getAllWcStaffFromDB
}