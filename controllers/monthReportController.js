const monthReportModel = require("../model/monthReportModel");
const nodemailer = require('nodemailer');
const ExcelJS = require('exceljs');
const fs = require('fs');


function createReport(req, res, next) {
  var startDate = req.body.startDate;
  var endDate = req.body.endDate;
  var doEmailTac = req.body.email1;
  var doEmailCoordinator = req.body.email2;
  var doDownload = req.body.download;
  var userID = req.body.userID;
  var userName = req.body.userName;

  monthReportModel.getDataFromDB(startDate, endDate, userID, function reportCallback(error, result, tacEmail, emailPasscode) {
    if(error) {
      console.log('Error in report callback');
      console.log(error);
    }
    else {
      var data = createNewArray(result);

      var workbook = new ExcelJS.Workbook();
      var filename = "./savedFiles/Templates/TemplateMonthlyReport.xlsx";
      workbook.xlsx.readFile(filename).then(() => {
    
        // edit worksheet
        var worksheet = workbook.getWorksheet('Sheet1');
  
        // if data found in DB
        if(data.length > 0) {
          fillWorksheet(worksheet, data, startDate);
    
          //Finally creating XLSX file
          var reportDate = getReportDate(startDate);
          var savedFilePath = "./savedFiles/MonthlyReport/Dues Reduction Monthly Credit Report for " + reportDate + ".xlsx";
          var savedFileName = "Dues Reduction Monthly Credit Report for " + reportDate + ".xlsx";
          workbook.xlsx.writeFile(savedFilePath).then(() => {
      
          // send files by email
          if(doEmailTac || doEmailCoordinator) {
            var sendTo = "";
            var count = 0;
            if(doEmailTac) {
              // TODO: get this email from DB
              sendTo += '';
              // sendTo += 'tholland@triangleaquatics.org';
              count++;
            }
            if(doEmailCoordinator) {
              if(count > 0) {
                sendTo += '; ';
              }
              sendTo += tacEmail;
            }

            var transport = nodemailer.createTransport({
              host: "smtp.gmail.com",
              port: 587,
              secure: false,
              auth: {
                user: tacEmail,
                pass: emailPasscode
              }
            });
      
            const mailOptions = {
              from: userName + ', ' + tacEmail,
              to: sendTo,
              subject: "Dues Reduction Monthly Credit Report for " + reportDate,
              html: "<h4>Dues Reduction Monthyl Credit Report.</h4>" +
                  "<div>Attached file for " + reportDate + "</div>",
              attachments: [
                {
                  filename: savedFileName,
                  path:  savedFilePath
                }
              ]
            };
        
            transport.sendMail(mailOptions, (error, info) => {
              if(error) {
                console.log("Error sending email. ");
                console.log(error);
              }
              else {
                console.log("Email has been sent.");
                // download file
                if(doDownload) {
                  res.download(savedFilePath, savedFileName, (err) => {
                    if(err) {console.log(err);}
                    else {
                      fs.unlink(savedFilePath, function (err) {
                        if(err) {throw err;}
                        else {res.end();}
                      }); 
                    }
                  });
                }
                // don't download file
                else {
                  res.send(info);
                  fs.unlink(savedFilePath, function (err) {
                    if(err) {throw err;}
                    else {res.end();}
                  }); 
                }
              }
            });
          }
           
          // Only download file; no emails sent
          else {
            res.download(savedFilePath, savedFileName, (err) => {
              if(err) {console.log(err);}
              else {
                fs.unlink(savedFilePath, function (err) {
                  if(err) {throw err;}
                  else {res.end();}
                }); 
              }
            });
          }

          }).catch(e => console.log("Catch: " + e));;
        }
    
        // no events found, send blank document
        else {
  
          fillBlankWorksheet(worksheet, startDate);
    
          //Finally creating XLSX file
          var reportDate = getReportDate(startDate);
          var savedFilePath = "./savedFiles/MontlyReport/Dues Reduction Monthly Credit Report for " + reportDate + ".xlsx";
          savedFileName = "Dues Reduction Monthly Credit Report for " + reportDate + ".xlsx";
          workbook.xlsx.writeFile(savedFilePath).then(() => {

              // send files by email
              if(doEmailTac || doEmailCoordinator) {
                var sendTo = "";
                var count = 0;
                if(doEmailTac) {
                  // TODO: enter correct info
                  sendTo += '';
              // sendTo += 'tholland@triangleaquatics.org';
                  count++;
                }
                if(doEmailCoordinator) {
                  if(count > 0) {
                    sendTo += '; ';
                  }
                  sendTo += tacEmail;
                }

                var transport = nodemailer.createTransport({
                  host: "smtp.gmail.com",
                  port: 587,
                  secure: false,
                  auth: {
                    user: tacEmail,
                    pass: emailPasscode
                  }
                });
          
                const mailOptions = {
                  from: userName + ', ' + tacEmail,
                  to: sendTo,
                  subject: "Dues Reduction Monthly Credit Report for " + reportDate,
                  html: "<h4>Dues Reduction Monthyl Credit Report.</h4>" +
                  "<div>Attached file for " + reportDate + "</div>",
                  attachments: [
                    {
                      filename: savedFileName,
                      path: savedFilePath
                    }
                  ]
                };
            
                transport.sendMail(mailOptions, (error, info) => {
                  if(error) {
                    console.log("Error sending email. ");
                    console.log(error);
                  }
                  else {
                    console.log("Email has been sent.");
                  // download file
                  if(doDownload) {
                    res.download(savedFilePath, savedFileName, (err) => {
                      if(err) {console.log(err);}
                      else {
                        fs.unlink(savedFilePath, function (err) {
                          if(err) {throw err;}
                          else {res.end();}
                        }); 
                      }
                    });
                  }
                  // don't download file
                  else {
                    res.send(info);
                    fs.unlink(savedFilePath, function (err) {
                      if(err) {throw err;}
                      else {res.end();}
                    }); 
                  }
                  }
                });
              }
      
            // Only download file; no emails sent
            else {
              res.download(savedFilePath, savedFileName, (err) => {
                if(err) {console.log(err);}
                else {
                  fs.unlink(savedFilePath, function (err) {
                    if(err) {throw err;}
                    else {res.end();}
                  }); 
                }
              });
            }
          }).catch(e => console.log("Catch: " + e));;
        }
      }).catch(e => console.log("Catch: " + e));
    }
  });
}

function createNewArray(result) {
  var account = [];
  var newArray = [];
  var j = 0;
  var id = 0;

  for(var i = 0; i < result.length; i++) {
    // new tu account; create new array
    if(result[i].idtu_account != id) {
      id = result[i].idtu_account;
      j += 1;
      account[j] = [];
      account[j].push(result[i]);
      newArray.push(account[j]);
    }
    // same tu account as before
    else {
      account[j].push(result[i]);
    }
  }
  return newArray;
}

function fillWorksheet(worksheet, data, startDate) {
  var date = getReportDate(startDate);
  var dateCell = worksheet.getCell('D1');
  dateCell.value = date;

  dataCellRow = 3;
  var totalAccountCredit = 0;
  var totalCredit = 0;

  for(var i = 0; i < data.length; i++) {
    for(var j = 0; j < data[i].length; j++) {

      if(j == 0) {
        var rowInsert = data[i].length;
        worksheet.duplicateRow(dataCellRow, rowInsert + 2, true);
        var tuAccountCell = worksheet.getCell('B' + dataCellRow);
        tuAccountCell.value = data[i][0].accountName;
      }
      var nameCell = worksheet.getCell('C' + dataCellRow);
      nameCell.value = data[i][j].lastName + ", " + data[i][j].firstName;
      var eventCell = worksheet.getCell('D' + dataCellRow);
      eventCell.value = data[i][j].Title;
      var dateCell = worksheet.getCell('E' + dataCellRow);
      dateCell.value = getEventDate(data[i][j].eventDateTime);
      var creditCell = worksheet.getCell('F' + dataCellRow);
      if(!data[i][j].creditAmount){   // if credit amount is null
        creditCell.value = 0;
      }
      else {
        creditCell.value = data[i][j].creditAmount;
      }
      totalAccountCredit += data[i][j].creditAmount;
      totalCredit += data[i][j].creditAmount;
      dataCellRow++;
    }
    var tuAccountCell2 = worksheet.getCell('E' + dataCellRow);
    tuAccountCell2.value = data[i][0].accountName;
    var totalAccountCell = worksheet.getCell('F' + dataCellRow);
    totalAccountCell.value = totalAccountCredit;
    // TODO: get cell fill working
          // worksheet.getCell('E6').fill = {
          //   type: "pattern",
          //   pattern: "solid",
          //   fgColor:{argb:'FF98FB98'}
          // };
          // worksheet.getCell('F6').fill = {
          //   type: "pattern",
          //   pattern: "solid",
          //   fgColor:{argb:'FF98FB98'}
          // };

    dataCellRow++;
    dataCellRow++;
    totalAccountCredit = 0;
  }
  var creditMsgCell = worksheet.getCell('E' + dataCellRow);
  creditMsgCell.value = "TOTAL CREDIT AMOUNT";
  var totalCreditCell = worksheet.getCell('F' + dataCellRow);
  totalCreditCell.value = totalCredit;
}

function fillBlankWorksheet(worksheet, startDate) {
  var date = getReportDate(startDate);
  var dateCell = worksheet.getCell('D1');
  dateCell.value = date;

  var noEventsCell = worksheet.getCell('B3');
  noEventsCell.value = "No events were worked."
}

function getReportDate(startDate) {
  var date = new Date(startDate);
  var m = date.getMonth();
  var month = "";
  if(m == 0) { month = "January"; }
  if(m == 1) { month = "February"; }
  if(m == 2) { month = "March"; }
  if(m == 3) { month = "April"; }
  if(m == 4) { month = "May"; }
  if(m == 5) { month = "June"; }
  if(m == 6) { month = "July"; }
  if(m == 7) { month = "August"; }
  if(m == 8) { month = "September"; }
  if(m == 9) { month = "October"; }
  if(m == 10) { month = "November"; }
  if(m == 11) { month = "December"; }

  var year = date.getFullYear();

  return month + " " + year;
}

function getEventDate(date) {
  var newDate = new Date(date);
  var month = newDate.getMonth() + 1;
  var day = newDate.getDate();
  var year = newDate.getFullYear();
  return month + "-" + day + "-" + year;
}

module.exports = {
  createReport: createReport
}