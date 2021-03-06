const venueModel = require('../model/venueModel');

function getVenues(req, res, next) {
  // console.log("getVenues function called");

  venueModel.getVenuesFromDB(function getVenueCallback(error, result) {
    if(error) {
      console.log("Error in venue callback");
      console.log(error);
    }
    else {
      res.status(200).json(result);
      res.end();
    }
  });
}

function getOneVenue(req, res, next) {
  // console.log('getOneVenue function called');
  const id = req.body.id;
  // console.log("Got id: " + id);

  venueModel.getOneVenueFromDB(id, function getOneVenueCallback(error, result) {
    if(error) {
      console.log('Error in one venue callback');
      console.log(error);
    }
    else {
      res.json(result);
      res.end();
    }
  });
}

module.exports = {
  getVenues: getVenues,
  getOneVenue: getOneVenue
}