const eventsWcModel = require('../model/eventWcModel');

function getEvents(req, res, next) {

  const seasonID = req.query.seasonID;

  eventsWcModel.getAllWcEventsFromDB(seasonID, function getEventCallback(error, result) {
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

function setNewWcEvent(req, res, next) {
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
    creditCardTips: req.body.creditCardTips,
    maxCreditCardTipAmount: req.body.maxCreditCardTipAmount,
    coordinatorAdminAmt: req.body.coordinatorAdminAmt,
    season: req.body.season
  };

  eventsWcModel.setNewEventInDB(newEvent, function setEventCallback(error, result) {
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

function editWcEvent(req, res, next) {
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
    creditCardTips: req.body.creditCardTips,
    maxCreditCardTipAmount: req.body.maxCreditCardTipAmount,
    coordinatorAdminAmt: req.body.coordinatorAdminAmt,
    season: req.body.season
  };

  eventsWcModel.editEventinDB(editEvent, function setEventCallback(error, result) {
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

function deleteWcEvent(req, res, next) {
  var eventID = req.body.idevent;

  eventsWcModel.deleteWcEventFromDB(eventID, function deleteCallback(error, result) {
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

function getContractWc(req, res, next) {
  var seasonID = req.query.seasonID;
  // console.log("seasonID: " + seasonID);

  eventsWcModel.getContractWcFromDB(seasonID, function contractCallback(error, result) {
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

function getWcJobs(req, res, next) {
  eventsWcModel.getWcJobsFromDB(function jobCallback(error, result) {
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
  setNewWcEvent: setNewWcEvent,
  editWcEvent: editWcEvent,
  deleteWcEvent: deleteWcEvent,
  getContractWc: getContractWc,
  getWcJobs: getWcJobs
}