const eventsCfModel = require('../model/eventCfModel');

function getEvents(req, res, next) {

  const seasonID = req.query.seasonID;

  eventsCfModel.getAllCfEventsFromDB(seasonID, function getEventCallback(error, result) {
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

function setNewCfEvent(req, res, next) {
  var date = new Date(req.body.Date);

  var newEvent = {
    idevent: req.body.idevent,
    Date: date,
    Title: req.body.Title,
    compensated: req.body.compensated,
    location: req.body.location,
    venueBonus: req.body.venueBonus,
    estimatedCheck: req.body.estimatedCheck,
    estimatedProfit: req.body.estimatedProfit,
    actualCheck: req.body.actualCheck,
    payout: req.body.payout,
    discrepancy: req.body.discrepancy,
    actualProfit: req.body.actualProfit,
    tacPct: req.body.tacPct,
    tacCut: req.body.tacCut,
    drCut: req.body.drCut,
    eventNotes: req.body.eventNotes,
    closed: req.body.closed,
    eventcol: req.body.eventcol,
    shuttleBonusBool: req.body.shuttleBonusBool,
    shuttleBonusAmount: req.body.shuttleBonusAmount,
    totalSales: req.body.totalSales,
    coordinatorAdminAmt: req.body.coordinatorAdminAmt,
    season: req.body.season
  };

  eventsCfModel.setNewEventInDB(newEvent, function setEventCallback(error, result) {
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

function editCfEvent(req, res, next) {
  var date = new Date(req.body.Date);

  var editEvent = {
    idevent: req.body.idevent,
    Date: date,
    Title: req.body.Title,
    compensated: req.body.compensated,
    location: req.body.location,
    venueBonus: req.body.venueBonus,
    estimatedCheck: req.body.estimatedCheck,
    estimatedProfit: req.body.estimatedProfit,
    actualCheck: req.body.actualCheck,
    payout: req.body.payout,
    discrepancy: req.body.discrepancy,
    actualProfit: req.body.actualProfit,
    tacPct: req.body.tacPct,
    tacCut: req.body.tacCut,
    drCut: req.body.drCut,
    eventNotes: req.body.eventNotes,
    closed: req.body.closed,
    eventcol: req.body.eventcol,
    shuttleBonusBool: req.body.shuttleBonusBool,
    shuttleBonusAmount: req.body.shuttleBonusAmount,
    totalSales: req.body.totalSales,
    coordinatorAdminAmt: req.body.coordinatorAdminAmt,
    season: req.body.season
  };

  eventsCfModel.editEventinDB(editEvent, function setEventCallback(error, result) {
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

function deleteCfEvent(req, res, next) {
  var eventID = req.body.idevent;

  eventsCfModel.deleteCfEventFromDB(eventID, function deleteCallback(error, result) {
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

function getContractCf(req, res, next) {
  var seasonID = req.query.seasonID;

  eventsCfModel.getContractCfFromDB(seasonID, function contractCallback(error, result) {
    if(error) {
      console.log('Error in contract callback');
      console.log(error);
    }
    else {
      res.status(200).json(result);
      res.end();
    }
  });
}

function getCfJobs(req, res, next) {
  eventsCfModel.getCfJobsFromDB(function jobCallback(error, result) {
    if(error) {
      console.log('Error in contract callback');
      console.log(error);
    }
    else {
      // console.log(json(result));
      res.status(200).json(result);
      res.end();
    }
  })
}

module.exports = {
  getEvents: getEvents,
  setNewCfEvent: setNewCfEvent,
  editCfEvent: editCfEvent,
  deleteCfEvent: deleteCfEvent,
  getContractCf: getContractCf,
  getCfJobs: getCfJobs
}