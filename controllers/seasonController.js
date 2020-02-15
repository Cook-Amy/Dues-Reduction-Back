const seasonModel = require('../model/seasonModel');

function getSeasons(req, res, next) {
  // console.log("function getSeasons() called");

  seasonModel.getAllSeasonsFromDB(function seasonCallback(error, result) {
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


module.exports = {
  getSeasons: getSeasons
}