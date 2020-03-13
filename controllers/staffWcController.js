const staffWcModel = require("../model/staffWcModel");

function getAllWcStaff (req, res, next) {
  staffWcModel.getAllWcStaffFromDB(function getStaffCallback(error, result) {
    if(error) {
      console.log('Error in staff callback');
      console.log(error);
    }
    else if(result.length == 0) {
      console.log("No staff info found in DB. Returning with null.");
      res.status(204).json(null);
      res.end();
    }
    else {
      res.status(200).json(result);
      res.end();
    }
  });
}

function getActiveWcStaff (req, res, next) {
  staffWcModel.getActiveWcStaffFromDB(function getStaffCallback(error, result) {
    if(error) {
      console.log('Error in staff callback');
      console.log(error);
    }
    else if(result.length == 0) {
      console.log("No staff info found in DB. Returning with null.");
      res.status(204).json(null);
      res.end();
    }
    else {
      res.status(200).json(result);
      res.end();
    }
  });
}

module.exports = {
  getAllWcStaff: getAllWcStaff,
  getActiveWcStaff: getActiveWcStaff
}