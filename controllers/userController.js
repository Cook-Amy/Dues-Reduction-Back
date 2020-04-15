const userModel = require("../model/userModel");

function changeSettings(req, res) {
  var user = req.body.user;

  userModel.changeSettingsInDB(user, (error, result, userNameFound) => {
    if(error) {
      console.log('Error in user settings callback');
      console.log(error);
    }
    else if(userNameFound) {
      res.status(200).json({username: userNameFound});
    }
    else {
      res.status(200).json({username: userNameFound});
      res.end();
    }
  });
}

module.exports = {
  changeSettings: changeSettings
}