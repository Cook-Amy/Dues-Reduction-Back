var pool = require('../database/db');

function getVenuesFromDB (callback) {
  console.log("getVenuesFromDB function called");
  // console.log("DB is connected inside getVenuesFromDB: " + db);

  var queryDB = "SELECT * FROM venue";
  pool.query(queryDB, (error, results) => {
    if(error) {
      console.log('Error getting results from DB: ');
      console.log(error);
      res.status(500).json({status: 'error'});
    }
    else {
      console.log("Results back from DB:");
      console.log(results);
      callback(null, results);
    }
  });
}


module.exports = {
  getVenuesFromDB: getVenuesFromDB
}