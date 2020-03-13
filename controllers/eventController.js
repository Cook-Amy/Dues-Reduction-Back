const eventModel = require('../model/eventModel');

function getEvents(req, res, next) {
  const seasonID = req.query.seasonID;

  eventModel.getEventsFromDB(seasonID, function getEventCallback(error, result) {
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

function addTimesheet(req, res, next) {
  const timesheet = req.body.timesheet;
  const eventID = req.body.eventID;

  eventModel.addTimesheetInDB(timesheet, eventID, (error, result) => {
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

function updateAllTimesheets(req, res, next) {
  const timesheets = req.body.timesheets;

  eventModel.updateAllTimesheetsInDB(timesheets, (error, result) => {
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

function deleteOneTimesheet(req, res, next) {
  const timesheetID = req.body.id;

  eventModel.deleteOneTimesheetInDB(timesheetID, (error, result) => {
    if(error) {
      console.log('Error in timesheet callback');
      console.log(error);
    }
    else {
      res.status(200).json(result);
      res.end();
    }
  })
}

function deleteOneEvent(req, res, next) {
  var eventID = req.body.idevent;

  eventModel.deleteOneEventFromDB(eventID, function deleteCallback(error, result) {
    if(error) {
      console.log('Error in editEvent callback');
      console.log(error);
    }
    else {
      res.status(200).json(result);
      res.end();
    }
  });
}

function editOneEvent(req, res, next) {
  var event = req.body.event;

  eventModel.editOneEventinDB(event, function setEventCallback(error, result) {
    if(error) {
      console.log('Error in editEvent callback');
      console.log(error);
    }
    else {
      res.status(200).json(result);
      res.end();
    }
  });
}


function setNewEvent(req, res, next) {
  var newEvent = req.body.event;

  eventModel.setNewEventInDB(newEvent, function setEventCallback(error, result) {
    if(error) {
      console.log('Error in setEvent callback');
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
  updateTimesheet: updateTimesheet,
  addTimesheet: addTimesheet,
  updateAllTimesheets: updateAllTimesheets,
  deleteOneTimesheet: deleteOneTimesheet,
  deleteOneEvent: deleteOneEvent,
  editOneEvent: editOneEvent,
  setNewEvent: setNewEvent
}