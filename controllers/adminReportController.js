const adminReportModel = require('../model/adminReportModel');
const nodemailer = require('nodemailer');
const ExcelJS = require('exceljs');
const fs = require('fs');

function createReport1(req, res, next) {
  var specs = req.body.specs;
  var doEmailCoordinator = specs.emailSummary;
  var doDownload = specs.downloadSummary;
  var userID = req.body.userID;
  var userName = req.body.userName;

  var start = getDate(specs.start);
  var end = getDate(specs.end);

  adminReportModel.getAdminReport1FromDB(specs, userID, function reportCallback(error, report, email) {
    if(error) { console.log(error); }
    else if(report != null && email != null) {
      var workbook = new ExcelJS.Workbook();
      var filename = "./savedFiles/Templates/TemplateAdminReport.xlsx";
      workbook.xlsx.readFile(filename).then(() => {
        var worksheet = workbook.getWorksheet('Sheet1');
        if(report.length > 0) {
          fillWorksheet(worksheet, specs, report);
  
          // Create XLSX file
          var savedFileName = "AdminReport_" + start + "_" + end + ".xlsx";
          var savedFilePath = './savedFiles/AdminReports/' + savedFileName;
          workbook.xlsx.writeFile(savedFilePath).then(() => {
            // send files by email
            if(doEmailCoordinator) {
              var sendTo = email.titansEmail;
              var transport = nodemailer.createTransport({
                host: "smtp.gmail.com",
                port: 587,
                secure: false,
                auth: {
                  user: sendTo,
                  pass:email.gmailPasscode
                }
              }); 
  
              const mailOptions = {
                from: email.name + ', ' + sendTo,
                to: sendTo,
                subject: "AdminReport " + start + " to " + end,
                html: "<h4>Titans Dues Reduction Admin Report</h4>",
                attachments: [
                  {
                    filename: savedFileName,
                    path: savedFilePath
                  }
                ]
              };
  
              transport.sendMail(mailOptions, (error, info) => {
                if(error) {
                  console.log("Error sending email.");
                  console.log(error);
                }
                else {
                  console.log("Email has been sent.");
                  // download file
                  if(doDownload) {
                    res.download(savedFilePath, savedFileName, (err) => {
                      if(err) {console.log(err);}
                      else {
                        fs.unlink(savedFilePath, function(err) {
                          if(err) { throw err; }
                          else { res.end(); }
                        });
                      }
                    });
                  }
                  // don't download file
                  else {
                    res.send(info);
                    fs.unlink(savedFilePath, function(err) {
                      if(err) { throw err; }
                      else { res.end(); }
                    });
                  }
                }
              });
            }
  
            // Only download file; no emails sent
            else {
              res.download(savedFilePath, savedFileName, (err) => {
                if(err) { console.log(err); }
                else {
                  fs.unlink(savedFilePath, function(err) {
                    if(err) { throw err; }
                    else { res.end(); }
                  });
                }
              });
            }
          }).catch(e => console.log("Catch: " + e));;
        }
  
        // no events found
        else {
          console.log("No events found.");
        }
      });
    }
    else {
      console.log("Events are null or email info is null");
    }
  });
}

function fillWorksheet(worksheet, specs, report) {
  // Fill Date
  var fromCell = worksheet.getCell('B3');
  fromCell.value = getDate(specs.start);
  var toCell = worksheet.getCell('B4');
  toCell.value = getDate(specs.end);

  // Set header row to wrap text
  worksheet.getCell('A6').alignment = { horizontal: 'center', wrapText: true };
  worksheet.getCell('B6').alignment = { horizontal: 'center', wrapText: true };
  worksheet.getCell('C6').alignment = { horizontal: 'center', wrapText: true };
  worksheet.getCell('D6').alignment = { horizontal: 'center', wrapText: true };
  worksheet.getCell('E6').alignment = { horizontal: 'center', wrapText: true };
  worksheet.getCell('F6').alignment = { horizontal: 'center', wrapText: true };
  worksheet.getCell('G6').alignment = { horizontal: 'center', wrapText: true };
  worksheet.getCell('H6').alignment = { horizontal: 'center', wrapText: true };
  worksheet.getCell('I6').alignment = { horizontal: 'center', wrapText: true };
  worksheet.getCell('J6').alignment = { horizontal: 'center', wrapText: true };

  var resultCellRow = 7;
  var resultCellColumn = 'B';
  var addRow = 1;
  var lngth = report.length;
  report.forEach(res => {
    if(lngth > addRow) {
      // add new row
      worksheet.duplicateRow(resultCellRow, 1, true);
      addRow++;
    }

    // fill event venue
    var venueCell = worksheet.getCell('A' + resultCellRow);
    venueCell.value = res["Venue"];

    // fill event Date
    if(specs.eventDate){
     var headerCell = worksheet.getCell(resultCellColumn + 6);
     headerCell.value = "Date";
      var dateCell = worksheet.getCell(resultCellColumn + resultCellRow);
      resultCellColumn = String.fromCharCode(resultCellColumn.charCodeAt(0) + 1);
      dateCell.value = res["Event Date"];
    }

    // fill event Title
    if(specs.eventName){
      // make column wider
      worksheet.getColumn(resultCellColumn).width = 25;

      var headerCell = worksheet.getCell(resultCellColumn + 6);
      headerCell.value = "Title";
       var dateCell = worksheet.getCell(resultCellColumn + resultCellRow);
       resultCellColumn = String.fromCharCode(resultCellColumn.charCodeAt(0) + 1);
       dateCell.value = res["Title"];
     }

     // fill event Location
    if(specs.eventLocation){
      var headerCell = worksheet.getCell(resultCellColumn + 6);
      headerCell.value = "Location";
       var dateCell = worksheet.getCell(resultCellColumn + resultCellRow);
       resultCellColumn = String.fromCharCode(resultCellColumn.charCodeAt(0) + 1);
       dateCell.value = res["Location"];
     }

     // fill event Payout
    if(specs.eventPayout){
      var headerCell = worksheet.getCell(resultCellColumn + 6);
      headerCell.value = "Payout";
       var dateCell = worksheet.getCell(resultCellColumn + resultCellRow);
       resultCellColumn = String.fromCharCode(resultCellColumn.charCodeAt(0) + 1);
       dateCell.value = res["Payout"].toFixed(2);
     }

     // fill event Check Received
    if(specs.eventCheck){
      var headerCell = worksheet.getCell(resultCellColumn + 6);
      headerCell.value = "Check Received";
       var dateCell = worksheet.getCell(resultCellColumn + resultCellRow);
       resultCellColumn = String.fromCharCode(resultCellColumn.charCodeAt(0) + 1);
       dateCell.value = res["Check Received"].toFixed(2);
     }

     // fill event Bonus
    if(specs.eventBonus){
      var headerCell = worksheet.getCell(resultCellColumn + 6);
      headerCell.value = "Venue Bonus";
       var dateCell = worksheet.getCell(resultCellColumn + resultCellRow);
       resultCellColumn = String.fromCharCode(resultCellColumn.charCodeAt(0) + 1);
       dateCell.value = res["Venue Bonus"].toFixed(2);
     }

     // fill event Discrepancy
    if(specs.eventDate){
      var headerCell = worksheet.getCell(resultCellColumn + 6);
      headerCell.value = "Discrepancy";
       var dateCell = worksheet.getCell(resultCellColumn + resultCellRow);
       resultCellColumn = String.fromCharCode(resultCellColumn.charCodeAt(0) + 1);
       dateCell.value = res["Discrepancy"].toFixed(2);
     }

     // fill event Profit
    if(specs.eventProfit){
      var headerCell = worksheet.getCell(resultCellColumn + 6);
      headerCell.value = "Profit";
       var dateCell = worksheet.getCell(resultCellColumn + resultCellRow);
       resultCellColumn = String.fromCharCode(resultCellColumn.charCodeAt(0) + 1);
       dateCell.value = res["Profit"].toFixed(2);
     }

    resultCellRow++;
    resultCellColumn = 'B';
  });
}

function getDate(date) {
  var newDate = new Date(date);
  var month = newDate.getMonth() + 1;
  var day = newDate.getDate();
  var year = newDate.getFullYear();
  return month + "-" + day + "-" + year;
}

module.exports = {
  createReport1: createReport1
}