const loginModel = require('../model/loginModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const saltRounds = 10;

function loginUser(req, res, next) {
  // console.log("loginUser function called");

  const email = req.body.email;
  const password = req.body.password;

  getHashedPassword(password);

  loginModel.getUserFromDB(email, password, function callback(error, result) {
    if(error) {
      console.log("Error in login callback");
      console.log(error);
    }
    else {
      if(result.length == 0) {
        console.log("User info is not correct. Returning with null.");
        res.status(204).json(null);
        res.end();
      }
      else {
        // console.log("User info correct. Returning to front.");
        const user = result;
        const token = jwt.sign({email: user.userName, userID: user.userID}, 'secret-long');
        res.status(200).json({token: token, user: user});
        res.end();
      }
    }
  });
}



/*******************************************************
 * GET HASHED PASSWORD
 * Used to get the hashed version of a password 
 * in order to save it to the DB
*********************************************************/
function getHashedPassword(password) {
  var hashedPassword = bcrypt.hashSync(password, saltRounds);
  console.log("Hashed Password: " + hashedPassword);
}

module.exports = {
  loginUser: loginUser
}