const staffPncModel = require("../model/staffPncModel");

function getAllPncStaff (req, res, next) {
  staffPncModel.getAllPncStaffFromDB(function getStaffCallback(error, result) {
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

function getActivePncStaff (req, res, next) {
  staffPncModel.getActivePncStaffFromDB(function getStaffCallback(error, result) {
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
  getAllPncStaff: getAllPncStaff,
  getActivePncStaff: getActivePncStaff
}