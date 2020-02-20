const eventsPncModel = require('../model/eventPncModel');

function getEvents(req, res, next) {

  const seasonID = req.query.seasonID;

  eventsPncModel.getAllPncEventsFromDB(seasonID, function getEventCallback(error, result) {
    if(error) {
      console.log('Error in event callback');
      console.log(error);
    }
    else if(result.length == 0) {
      console.log("No event info found in DB. Returning with null.");
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
  getEvents: getEvents
}