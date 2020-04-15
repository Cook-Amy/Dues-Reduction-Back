var pool = require('../database/db');

function changeSettingsInDB(user, callback) {
  var queryDB = "SELECT idsite_user FROM site_user WHERE userName = ?";
  var params = [user.userName];

  pool.query(queryDB, params, (error, results) => {
    if(error) {
      console.log("Error changing user settings into DB: ");
      console.log(error);
    }
    else if(results.length > 0) {
      callback(null, results, true);
    }
    else {
      saveSettingsInDB(user, callback);
    }
  });
}

function saveSettingsInDB(user, callback) {
  var queryDB = "UPDATE site_user " + 
                "SET firstName = ?, lastName = ?, phone = ?, " +
                    "titansEmail = ?, personalEmail = ?, userName = ? " +
                "WHERE idsite_user = ?";
  params = [
    user.firstName,
    user.lastName,
    user.phone,
    user.titansEmail,
    user.personalEmail,
    user.userName,
    user.userID
  ]

  pool.query(queryDB, params, (error, results) => {
    if(error) {
      console.log("Error changing user settings into DB: ");
      console.log(error);
    }
    else {
      callback(null, results, false);
    }
  });
}

module.exports = {
  changeSettingsInDB: changeSettingsInDB
}