const venueModel = require('../model/venueModel');

function getVenues(req, res, next) {
  console.log("getVenues function called");

  venueModel.getVenuesFromDB(function getVenueCallback(error, result) {
    if(error) {
      console.log("Error in venue callback");
      console.log(error);
    }
    else {
      res.json(result);
      res.end();
    }
  })
}

module.exports = {
  getVenues: getVenues
}