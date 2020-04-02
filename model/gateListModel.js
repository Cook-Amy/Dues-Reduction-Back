var pool = require('../database/db');

function getCoordinatorInfoFromDB(userID, callback) {
  queryDB = "SELECT titansEmail, gmailPasscode " +
            "FROM site_user " + 
            "WHERE idsite_user = ? ";
  params = [userID];

  pool.query(queryDB, params, (error, results) => {
    if(error) {
      console.log("Error getting report results from DB: ");
      console.log(error);
    }
    else if(results.length == 0) {
      console.log("Report results not found in DB");
      callback(null, '', '');

    }
    else {
      callback(null, results[0].titansEmail, results[0].gmailPasscode);
    }
  });
}

module.exports = {
  getCoordinatorInfoFromDB: getCoordinatorInfoFromDB
}