const eventsPncModel = require('../model/eventPncModel');
const eventPnc = require('../formats/eventPnc');

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

function setNewPncEvent(req, res, next) {
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
    metCommissionBonus: req.body.metCommissionBonus,
    guarantee: req.body.guarantee,
    totalSales: req.body.totalSales,
    alcSales: req.body.alcSales,
    coordinatorAdminAmt: req.body.coordinatorAdminAmt,
    eventCountsTowardsTotal: req.body.eventCountsTowardsTotal,
    season: req.body.season
  };

  eventsPncModel.setNewEventInDB(newEvent, function setEventCallback(error, result) {
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

function editPncEvent(req, res, next) {
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
    metCommissionBonus: req.body.metCommissionBonus,
    guarantee: req.body.guarantee,
    totalSales: req.body.totalSales,
    alcSales: req.body.alcSales,
    coordinatorAdminAmt: req.body.coordinatorAdminAmt,
    eventCountsTowardsTotal: req.body.eventCountsTowardsTotal,
    season: req.body.season
  };

  eventsPncModel.editEventinDB(editEvent, function setEventCallback(error, result) {
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

function deletePncEvent(req, res, next) {
  var eventID = req.body.idevent;

  eventsPncModel.deletePncEventFromDB(eventID, function deleteCallback(error, result) {
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

function getContractPnc(req, res, next) {
  var seasonID = req.query.seasonID;
  // console.log("seasonID: " + seasonID);

  eventsPncModel.getContractPncFromDB(seasonID, function contractCallback(error, result) {
    if(error) {
      console.log('Error in contract callback');
      console.log(error);
    }
    else {
      // console.log(json(result));
      res.status(200).json(result);
      res.end();
    }
  });
}

function getPncJobs(req, res, next) {
  eventsPncModel.getPncJobsFromDB(function jobCallback(error, result) {
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
  setNewPncEvent: setNewPncEvent,
  editPncEvent: editPncEvent,
  deletePncEvent: deletePncEvent,
  getContractPnc: getContractPnc,
  getPncJobs: getPncJobs
}