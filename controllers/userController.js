const userModel = require("../model/userModel");

function changeSettings(req, res) {
  var user = req.body.user;

  userModel.changeSettingsInDB(user, (error, result) => {
    if(error) {
      console.log('Error in user settings callback');
      console.log(error);
    }
    else {
      res.status(200).json(result);
      res.end();
    }
  });
}

module.exports = {
  changeSettings: changeSettings
}