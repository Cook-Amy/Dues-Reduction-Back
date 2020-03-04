var pool = require('../database/db');

function getVenuesFromDB (callback) {
  // console.log("DB is connected inside getVenuesFromDB: " + db);

  var queryDB = "SELECT * FROM venue";
  pool.query(queryDB, (error, results) => {
    if(error) {
      console.log('Error getting venue results from DB: ');
      console.log(error);
      // results.status(500).json({status: 'error'});
    }
    else {
      // console.log("Results back from DB:");
      // console.log(results);
      callback(null, results);
    }
  });
}

function getOneVenueFromDB(id, callback) {
  // console.log('getOneVenueFromDB function called');

  var queryDB = "SELECT name FROM venue WHERE idvenue = " + id;
  pool.query(queryDB, (error, results) => {
    if(error) {
      console.log("Error getting results from DB");
      console.log(error);
    }
    else {
      console.log("Results back from DB: ");
      // console.log(results);
      callback(null, results);
    }
  })
}


module.exports = {
  getVenuesFromDB: getVenuesFromDB,
  getOneVenueFromDB: getOneVenueFromDB
}