const reminderModel = require("../model/reminderModel");
const nodemailer = require('nodemailer');


/*****************************************************************************
 * PNC Reminder Emails
*****************************************************************************/
function sendPncReminder(req, res, next) {
  var list = req.body.list;
  var removeReminderText = req.body.removeReminderText;
  var emailText = req.body.emailText;
  var eventID = req.body.eventID;
  var userID = req.body.userID;
  var userName = req.body.userName;

  var additionalNotes = 'None';
  if(emailText != '' && emailText != null) {
    additionalNotes = emailText;
  }
  var msgSplit = additionalNotes.split('\n');
  additionalNotes = msgSplit.join('<br>');

  reminderModel.getEmailforReminder(list, eventID, userID, function emailCallback(error, result, coordinator) {
    if(error) {
      console.log('Error in email callback');
      console.log(error);
    }
    else {
      var coordName = coordinator.firstName + " " + coordinator.lastName;
      var coordPhone = coordinator.phone;
      var coordEmail = coordinator.titansEmail;
      var coordPasscode = coordinator.gmailPasscode;

      if(result.length == 1) {
        var eventDate = returnDateStr(result[0].eventDateTime);
        var eventTime = returnTimeStr(result[0].scheduledArrivalTime);

        var emailStr = "";
        if(!removeReminderText) {
          emailStr += "<h4>Just a quick reminder about the upcoming PNC event.</h4><br>" +
          "<div><strong>Name:</strong> " + result[0].firstName + " " + result[0].lastName +"</div>" +
          "<div><strong>Event:</strong> " + result[0].Title + "</div>" +
          "<div><strong>Date:</strong> " + eventDate + "</div>" +
          "<div><strong>Location:</strong> " + result[0].location +  "</div><br>"+
          "<div><strong>Position:</strong> " + result[0].jobName + "</div>" + 
          "<div><strong>Arrival Time:</strong> " + eventTime + "</div><br>" +
          "<div><strong>Additional Notes:</strong> <br>" + additionalNotes + "</div><br>";
        }
        else {
          emailStr += "<div>" + additionalNotes + "</div><br>"
        }

        emailStr += "<div>Thank you, </div>" +
        "<div>" + coordName + "</div>"+
        "<div>" + coordPhone + "</div>";

        var transport = nodemailer.createTransport({
          host: "smtp.gmail.com",
          port: 587,
          secure: false,
          auth: {
            user: coordEmail,
            pass: coordPasscode
          }
        });
  
        const mailOptions = {
          from: coordName + ', ' + coordEmail,
          to: result[0].email,
          subject: "Event Reminder for " +  result[0].Title + " - " + eventDate,
          html: emailStr,
        };
    
        transport.sendMail(mailOptions, (error, info) => {
          if(error) {
            console.log("Error sending email. ");
            console.log(error);
          }
          else {
            console.log("Email has been sent.");
          }
        });
      }

      else {
        for(var i = 0; i < result.length; i++) {
          var eventDate = returnDateStr(result[i][0].eventDateTime);
          var eventTime = returnTimeStr(result[i][0].scheduledArrivalTime);
  
          var emailStr = "";
          if(!removeReminderText) {
            emailStr += "<h4>Just a quick reminder about the upcoming PNC event.</h4><br>" +
            "<div><strong>Name:</strong> " + result[i][0].firstName + " " + result[i][0].lastName +"</div>" +
            "<div><strong>Event:</strong> " + result[i][0].Title + "</div>" +
            "<div><strong>Date:</strong> " + eventDate + "</div>" +
            "<div><strong>Location:</strong> " + result[i][0].location +  "</div><br>"+
            "<div><strong>Position:</strong> " + result[i][0].jobName + "</div>" + 
            "<div><strong>Arrival Time:</strong> " + eventTime + "</div><br>" +
            "<div><strong>Additional Notes:</strong> <br>" + additionalNotes + "</div><br>";
          }
          else {
            emailStr += "<div>" + additionalNotes + "</div><br>"
          }
  
          emailStr += "<div>Thank you, </div>" +
          "<div>" + coordName + "</div>"+
          "<div>" + coordPhone + "</div>";
  
          var transport = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 587,
            secure: false,
            auth: {
              user: coordEmail,
              pass: coordPasscode
            }
          });
    
          const mailOptions = {
            from: coordName + ', ' + coordEmail,
            to: result[i][0].email,
            subject: "Event Reminder for " +  result[i][0].Title + " - " + eventDate,
            html: emailStr,
          };
      
          transport.sendMail(mailOptions, (error, info) => {
            if(error) {
              console.log("Error sending email. ");
              console.log(error);
            }
            else {
              console.log("Email has been sent.");
            }
          });
        }
      }
      res.status(200).json(result);
      res.end();
    }
  });
}


/*****************************************************************************
 * WC Reminder Emails
*****************************************************************************/
function sendWcReminder(req, res, next) {
  var list = req.body.list;
  var removeReminderText = req.body.removeReminderText;
  var emailText = req.body.emailText;
  var eventID = req.body.eventID;
  var userID = req.body.userID;
  var userName = req.body.userName;

  var additionalNotes = 'None';
  if(emailText != '' && emailText != null) {
    additionalNotes = emailText;
  }
  var msgSplit = additionalNotes.split('\n');
  additionalNotes = msgSplit.join('<br>');

  reminderModel.getEmailforReminder(list, eventID, userID, function emailCallback(error, result, coordinator) {
    if(error) {
      console.log('Error in email callback');
      console.log(error);
    }
    else {
      var coordName = coordinator.firstName + " " + coordinator.lastName;
      var coordPhone = coordinator.phone;
      var coordEmail = coordinator.titansEmail;
      var coordPasscode = coordinator.gmailPasscode;

      if(result.length == 1) {
        var eventDate = returnDateStr(result[0].eventDateTime);
        var eventTime = returnTimeStr(result[0].scheduledArrivalTime);

        var emailStr = "";
        if(!removeReminderText) {
           emailStr += "<h4>Just a quick reminder about the upcoming Walnut Creek event.</h4><br>" +
          "<div><strong>Name:</strong> " + result[0].firstName + " " + result[0].lastName +"</div>" +
          "<div><strong>Event:</strong> " + result[0].Title + "</div>" +
          "<div><strong>Date:</strong> " + eventDate + "</div>" +
          "<div><strong>Location:</strong> " + result[0].location +  "</div><br>"+
          "<div><strong>Position:</strong> " + result[0].jobName + "</div>" + 
          "<div><strong>Arrival Time:</strong> " + eventTime + "</div><br>" +
          "<div><strong>Additional Notes:</strong> <br>" + additionalNotes + "</div><br>";
        }
        else {
          emailStr += "<div>" + additionalNotes + "</div><br>"
        }

        emailStr += "<div>Thank you, </div>" +
        "<div>" + coordName + "</div>"+
        "<div>" + coordPhone + "</div>";

        var transport = nodemailer.createTransport({
          host: "smtp.gmail.com",
          port: 587,
          secure: false,
          auth: {
            user: coordEmail,
            pass: coordPasscode
          }
        });
  
        const mailOptions = {
          from: coordName + ', ' + coordEmail,
          to: result[0].email,
          subject: "Event Reminder for " +  result[0].Title + " - " + eventDate,
          html: emailStr,
        };
    
        transport.sendMail(mailOptions, (error, info) => {
          if(error) {
            console.log("Error sending email. ");
            console.log(error);
          }
          else {
            console.log("Email has been sent.");
          }
        });
      }

      else {
        for(var i = 0; i < result.length; i++) {
          var eventDate = returnDateStr(result[i][0].eventDateTime);
          var eventTime = returnTimeStr(result[i][0].scheduledArrivalTime);
  
          var emailStr = "";
          if(!removeReminderText) {
            emailStr += "<h4>Just a quick reminder about the upcoming Walnut Creek event.</h4><br>" +
           "<div><strong>Name:</strong> " + result[i][0].firstName + " " + result[i][0].lastName +"</div>" +
           "<div><strong>Event:</strong> " + result[i][0].Title + "</div>" +
           "<div><strong>Date:</strong> " + eventDate + "</div>" +
           "<div><strong>Location:</strong> " + result[i][0].location +  "</div><br>"+
           "<div><strong>Position:</strong> " + result[i][0].jobName + "</div>" + 
           "<div><strong>Arrival Time:</strong> " + eventTime + "</div><br>" +
           "<div><strong>Additional Notes:</strong> <br>" + additionalNotes + "</div><br>";
         }
          else {
            emailStr += "<div>" + additionalNotes + "</div><br>"
          }
  
          emailStr += "<div>Thank you, </div>" +
          "<div>" + coordName + "</div>"+
          "<div>" + coordPhone + "</div>";
  
          var transport = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 587,
            secure: false,
            auth: {
              user: coordEmail,
              pass: coordPasscode
            }
          });
    
          const mailOptions = {
            from: coordName + ', ' + coordEmail,
            to: result[i][0].email,
            subject: "Event Reminder for " +  result[i][0].Title + " - " + eventDate,
            html: emailStr,
          };
      
          transport.sendMail(mailOptions, (error, info) => {
            if(error) {
              console.log("Error sending email. ");
              console.log(error);
            }
            else {
              console.log("Email has been sent.");
            }
          });
        }
      }
      res.status(200).json(result);
      res.end();
    }
  });
}


/*****************************************************************************
 * CF Reminder Emails
*****************************************************************************/
function sendCfReminder(req, res, next) {
  var list = req.body.list;
  var removeReminderText = req.body.removeReminderText;
  var emailText = req.body.emailText;
  var eventID = req.body.eventID;
  var userID = req.body.userID;
  var userName = req.body.userName;

  var additionalNotes = 'None';
  if(emailText != '' && emailText != null) {
    additionalNotes = emailText;
  }
  var msgSplit = additionalNotes.split('\n');
  additionalNotes = msgSplit.join('<br>');

  reminderModel.getEmailforReminder(list, eventID, userID, function emailCallback(error, result, coordinator) {
    if(error) {
      console.log('Error in email callback');
      console.log(error);
    }
    else {
      var coordName = coordinator.firstName + " " + coordinator.lastName;
      var coordPhone = coordinator.phone;
      var coordEmail = coordinator.titansEmail;
      var coordPasscode = coordinator.gmailPasscode;

      if(result.length == 1) {
        var eventDate = returnDateStr(result[0].eventDateTime);
        var eventTime = returnTimeStr(result[0].scheduledArrivalTime);

        var emailStr = "";
        if(!removeReminderText) {
          emailStr += "<h4>Just a quick reminder about the upcoming Carter-Finley Stadium event.</h4><br>" +
          "<div><strong>Name:</strong> " + result[0].firstName + " " + result[0].lastName +"</div>" +
          "<div><strong>Event:</strong> " + result[0].Title + "</div>" +
          "<div><strong>Date:</strong> " + eventDate + "</div>" +
          "<div><strong>Location:</strong> " + result[0].location +  "</div><br>"+
          "<div><strong>Position:</strong> " + result[0].jobName + "</div>" + 
          "<div><strong>Arrival Time:</strong> " + eventTime + "</div><br>" +
          "<div><strong>Additional Notes:</strong> <br>" + additionalNotes + "</div><br>";
        }
        else {
          emailStr += "<div>" + additionalNotes + "</div><br>"
        }

        emailStr += "<div>Thank you, </div>" +
        "<div>" + coordName + "</div>"+
        "<div>" + coordPhone + "</div>";

        var transport = nodemailer.createTransport({
          host: "smtp.gmail.com",
          port: 587,
          secure: false,
          auth: {
            user: coordEmail,
            pass: coordPasscode
          }
        });
  
        const mailOptions = {
          from: coordName + ', ' + coordEmail,
          to: result[0].email,
          subject: "CF Event: " +  result[0].Title + " - " + eventDate,
          html: emailStr,
        };
    
        transport.sendMail(mailOptions, (error, info) => {
          if(error) {
            console.log("Error sending email. ");
            console.log(error);
          }
          else {
            console.log("Email has been sent.");
          }
        });
      }

      else {
        for(var i = 0; i < result.length; i++) {
          var eventDate = returnDateStr(result[i][0].eventDateTime);
          var eventTime = returnTimeStr(result[i][0].scheduledArrivalTime);
  
          var emailStr = "";
          if(!removeReminderText) {
            emailStr += "<h4>Just a quick reminder about the upcoming Carter-Finley Stadium event.</h4><br>" +
            "<div><strong>Name:</strong> " + result[i][0].firstName + " " + result[i][0].lastName +"</div>" +
            "<div><strong>Event:</strong> " + result[i][0].Title + "</div>" +
            "<div><strong>Date:</strong> " + eventDate + "</div>" +
            "<div><strong>Location:</strong> " + result[i][0].location +  "</div><br>"+
            "<div><strong>Position:</strong> " + result[i][0].jobName + "</div>" + 
            "<div><strong>Arrival Time:</strong> " + eventTime + "</div><br>" +
            "<div><strong>Additional Notes:</strong> <br>" + additionalNotes + "</div><br>";
          }
          else {
            emailStr += "<div>" + additionalNotes + "</div><br>"
          }

          emailStr += "<div>Thank you, </div>" +
            "<div>" + coordName + "</div>"+
            "<div>" + coordPhone + "</div>";
  
          var transport = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 587,
            secure: false,
            auth: {
              user: coordEmail,
              pass: coordPasscode
            }
          });
    
          const mailOptions = {
            from: coordName + ', ' + coordEmail,
            to: result[i][0].email,
            subject: "Event Reminder for " +  result[i][0].Title + " - " + eventDate,
            html: emailStr,
          };
      
          transport.sendMail(mailOptions, (error, info) => {
            if(error) {
              console.log("Error sending email. ");
              console.log(error);
            }
            else {
              console.log("Email has been sent.");
            }
          });
        }
      }
      res.status(200).json(result);
      res.end();
    }
  });
}

function returnDateStr(date) {
  var newDate = new Date(date).toLocaleString('en-US', { timeZone: 'America/New_York' });
  var tzDate = new Date(newDate);

  var day = tzDate.getDay();
  var dayOfWeek = "";
  if(day == 0) { dayOfWeek = "Sunday"; }
  if(day == 1) { dayOfWeek = "Monday"; }
  if(day == 2) { dayOfWeek = "Tuesday"; }
  if(day == 3) { dayOfWeek = "Wednesday"; }
  if(day == 4) { dayOfWeek = "Thursday"; }
  if(day == 5) { dayOfWeek = "Friday"; }
  if(day == 6) { dayOfWeek = "Saturday"; }

  var month = tzDate.getMonth();
  var monthStr = "";
  if(month == 0) { monthStr = "January"; }
  if(month == 1) { monthStr = "February"; }
  if(month == 2) { monthStr = "March"; }
  if(month == 3) { monthStr = "April"; }
  if(month == 4) { monthStr = "May"; }
  if(month == 5) { monthStr = "June"; }
  if(month == 6) { monthStr = "July"; }
  if(month == 7) { monthStr = "August"; }
  if(month == 8) { monthStr = "September"; }
  if(month == 9) { monthStr = "October"; }
  if(month == 10) { monthStr = "November"; }
  if(month == 11) { monthStr = "December"; }

  return dayOfWeek + ", " + monthStr + " " + tzDate.getDate();
}

function returnTimeStr(time) {
  var newTime = new Date(time).toLocaleString('en-US', { timeZone: 'America/New_York' });
  var tzTime = new Date(newTime);

  var hrs = tzTime.getHours();
  var ending = "AM";
  if(hrs >= 12) { ending = "PM"; }
  if(hrs > 12) { hrs -= 12; }
  else if(hrs == 0) { hrs == 12; }

  var min =(tzTime.getMinutes() < 10 ? '0' : '') + tzTime.getMinutes();

  return hrs + ":" + min + " " + ending;
}

module.exports = {
  sendPncReminder: sendPncReminder,
  sendWcReminder: sendWcReminder,
  sendCfReminder: sendCfReminder
}