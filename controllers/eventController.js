const eventModel = require('../model/eventModel');

function getEvents(req, res, next) {

  // const venueID = 1;
  const venueID = req.query.venueID;
  const seasonID = req.query.seasonID;
  // console.log("seasonID: " + seasonID + ", venueID: " + venueID);

  eventModel.getEventsFromDB(venueID, seasonID, function getEventCallback(error, result) {
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

function getTimesheetForEvent(req, res, next) {
  const eventID = req.query.eventID;

  eventModel.getTimesheetForEventFromDB(eventID, (error, result) => {
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

function updateTimesheet(req, res, next) {
  const timesheet = req.body.timesheet;

  eventModel.updateTimesheetInDB(timesheet, (error, result) => {
    if(error) {
      console.log('Error in timesheet callback');
      console.log(error);
    }
    else {
      res.status(200).json(result);
      res.end();
    }
  });
}

module.exports = {
  getEvents: getEvents,
  getTimesheetForEvent: getTimesheetForEvent,
  updateTimesheet: updateTimesheet
}