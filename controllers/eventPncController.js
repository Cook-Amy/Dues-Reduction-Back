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
  var date = req.body.Date;
  var convertDate = date.substring(0, date.length - 1);

  var newEvent = {
    idevent: req.body.idevent,
    Date: convertDate,
    Title: req.body.Title,
    compensated: req.body.compensated,
    location: req.body.location,
    venueBonue: req.body.venueBonus,
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
    coordinatorAdminAmount: req.body.coordinatorAdminAmount,
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

module.exports = {
  getEvents: getEvents,
  setNewPncEvent: setNewPncEvent
}