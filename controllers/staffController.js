const staffModel = require('../model/staffModel');

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

module.exports = {
  getStaffForEvent: getStaffForEvent
}