var pool = require('../database/db');
const bcrypt = require('bcryptjs');

function getUserFromDB(email, password, callback) {
  var query = "SELECT idsite_user, userName, password, permission FROM site_user WHERE userName = ?";
  var params = [email]

  pool.query(query, params, (error, results) => {
    if(error) {
      console.log('Error getting results from DB: ');
      console.log(error);
      res.status(500).json({status: 'error'});
    }
    if(results.length == 0) {
      console.log("User of " + email + " is not found in DB");
      callback(null, results);
    }
    else {
      console.log("Results back from DB:");
      console.log(results);
      checkPassword(password, results, callback);
    }
  });
}

function checkPassword(password, results, callback) {
  var pwd = results[0].password;
  bcrypt.compare(password, pwd, function(err, res) {
    if(res == true) {
      console.log("passwords match");
      var userJson = [{email: results[0].userName, permission: results[0].permission}];
      callback(null, userJson);
    }
    else {
      console.log("passwords do not match");
      var noResults = [];
      callback(null, noResults);
    }
  });
}

module.exports = {
  getUserFromDB: getUserFromDB
}