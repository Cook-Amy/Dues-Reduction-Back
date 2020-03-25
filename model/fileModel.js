var pool = require('../database/db');

function getFilesFromDB(id, callback) {
  var queryDB = "";
  var params = [];

  if(id == 99) {
    queryDB = "SELECT idfileLinks AS idlink, venueID, fileName AS Name, link AS Link, description " +
              "FROM filelinks " +
              "WHERE isAdmin = 1";
  }
  else {
    queryDB = "SELECT idfileLinks AS idlink, venueID, fileName AS Name, link AS Link, description " +
              "FROM filelinks " +
              "WHERE venueID = ?";
    params.push(id);
  }

  pool.query(queryDB, params, (error, results) => {
    if(error) {
      console.log("Error getting files from DB: ");
      console.log(error);
    }
    else {
      callback(null, results);
    }
  });
}

function removeFileFromDB(fileID, venueID, callback) {
  var queryDB = "DELETE FROM filelinks WHERE idfileLinks = ?";
  var params = [fileID];

  pool.query(queryDB, params, (error, results) => {
    if(error) {
      console.log("Error getting files from DB: ");
      console.log(error);
    }
    else {
      getFilesFromDB(venueID, callback);
    }
  });
}

function saveFileInDB(file, callback) {
  var venueID = file.venueID;
  var fileName = file.Name;
  var link = file.Link;
  var description = file.description;
  var isAdmin = 0;

  if(venueID == 99) {
    venueID = null;
    isAdmin = 1;
  }
  var queryDB = "INSERT INTO filelinks " +
                  "(venueID, fileName, link, description, isAdmin) " +
                "VALUES (?, ?, ?, ?, ?)";
  var params = [
    venueID,
    fileName,
    link,
    description,
    isAdmin
  ]

  pool.query(queryDB, params, (error, results) => {
    if(error) {
      console.log("Error getting files from DB: ");
      console.log(error);
    }
    else {
      getFilesFromDB(file.venueID, callback);
    }
  });
}


module.exports = {
  getFilesFromDB: getFilesFromDB,
  removeFileFromDB: removeFileFromDB,
  saveFileInDB: saveFileInDB
}
