var pool = require('../database/db');

function getAllSeasonsFromDB (callback) {
  // console.log("getVenuesFromDB function called");
  // console.log("DB is connected inside getVenuesFromDB: " + db);

  var queryDB = "SELECT * FROM season";
  pool.query(queryDB, (error, results) => {
    if(error) {
      console.log('Error getting results from DB: ');
      console.log(error);
      // res.status(500).json({status: 'error'});
    }
    else {
      callback(null, results);
    }
  });
}

module.exports = {
  getAllSeasonsFromDB: getAllSeasonsFromDB
}