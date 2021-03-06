const staffCfModel = require("../model/staffCfModel");

function getAllCfStaff (req, res, next) {
  staffCfModel.getAllCfStaffFromDB(function getStaffCallback(error, result) {
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

function getActiveCfStaff (req, res, next) {
  staffCfModel.getActiveCfStaffFromDB(function getStaffCallback(error, result) {
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
  getAllCfStaff: getAllCfStaff,
  getActiveCfStaff: getActiveCfStaff
}