const staffModel = require('../model/staffModel');

function getAllStaff(req, res, next) {
  staffModel.getAllStaffFromDB(function getStaffCallback(error, staffResult, trainingResult) {
    if(error) {
      console.log('Error in staff callback');
      console.log(error);
    }
    else if(staffResult.length == 0) {
      console.log("No staff info found in DB. Returning with null.");
      res.status(204).json(null);
      res.end();
    }
    else {
      res.status(200).json({staffResult: staffResult, trainingResult: trainingResult});
      res.end();
    }
  });
}

function getStaffForEvent(req, res, next) {
  const eventID = req.query.eventID;

  staffModel.getStaffForEventFromDB(eventID, function getStaffcallback(error, result) {
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

function addOneStaff(req, res, next) {
  const newStaff = req.body.staff;

  staffModel.addOneStaffToDB(newStaff, function getStaffCallback(error, result, id) {
    if(error) {
      console.log('Error in staff callback');
      console.log(error);
    }
    else {
      console.log("id: " + id);
      res.status(200).json(id);
      res.end();
    }
  });
}

function updateOneStaff(req, res, next) {
  const newStaff = req.body.staff;

  staffModel.updateOneStaffInDB(newStaff, function getStaffCallback(error, result) {
    if(error) {
      console.log('Error in staff callback');
      console.log(error);
    }
    else {
      res.status(200).json(result);
      res.end();
    }
  });
}

function removeStaff(req, res, next) {
  const staff = req.body.staff;

  staffModel.removeStaffinDB(staff, function staffCallback(error, result) {
    if(error) {
      console.log('Error in staff callback');
      console.log(error);
    }
    else {
      res.status(200).json(result);
      res.end();
    }
  });
}

function getAllTuAccounts(req, res) {
  staffModel.getAllTuAccountsFromDB((error, result) => {
    if(error) {
      console.log('Error in tuAccount callback');
      console.log(error);
    }
    else {
      res.status(200).json(result);
      res.end();
    }
  });
}

module.exports = {
  getAllStaff: getAllStaff,
  getStaffForEvent: getStaffForEvent,
  addOneStaff: addOneStaff,
  updateOneStaff: updateOneStaff,
  removeStaff: removeStaff,
  getAllTuAccounts: getAllTuAccounts
}