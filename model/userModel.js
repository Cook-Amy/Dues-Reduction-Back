var pool = require('../database/db');

function changeSettingsInDB(user, callback) {
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
      callback(null, results);
    }
  });
}

module.exports = {
  changeSettingsInDB: changeSettingsInDB
}