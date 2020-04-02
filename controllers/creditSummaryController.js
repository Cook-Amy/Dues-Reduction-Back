const creditSummaryModel = require('../model/creditSummaryModel');
const nodemailer = require('nodemailer');
const ExcelJS = require('exceljs');
const fs = require('fs');


function createSummary(req, res, next) {
  var specs = req.body.specs;
  var doEmailMember = specs.email1;
  var doEmailCoordinator = specs.email2;
  var doDownload = specs.download;

  creditSummaryModel.getTuAccountFromDB(specs.staffID, specs.start, specs.end, function reportCallback(error, result, accountName, memberEmail) {

    var workbook = new ExcelJS.Workbook();
    var filename = "./savedFiles/Templates/TemplateCreditSummary.xlsx";
    workbook.xlsx.readFile(filename).then(() => {
  
      // edit worksheet
      var worksheet = workbook.getWorksheet('Sheet1');
      var arr = assembleResults(result);

      // if events found in DB
      if(arr.length > 0) {
        fillWorksheet(worksheet, arr, specs.start, specs.end);
        var name = accountName;
  
        //Finally creating XLSX file
        var savedFilePath = "./savedFiles/CreditSummary/CreditSummary_" + name + ".xlsx";
        var savedFileName = "CreditSummary_" + name + ".xlsx";
        workbook.xlsx.writeFile(savedFilePath).then(() => {

            // send files by email
            if(doEmailMember || doEmailCoordinator) {
              var sendTo = "";
              var count = 0;
              if(doEmailMember) {
                console.log("email sent to member: " + memberEmail);
                sendTo += memberEmail;
                count++;
              }
              // TODO: Get coordinators name & email from DB
              if(doEmailCoordinator) {
                console.log("email send to coordinator");
                if(count > 0) {
                  sendTo += '; ';
                }
                sendTo += 'coo17045@byui.edu';
              }

              var transport = nodemailer.createTransport({
                host: "smtp.gmail.com",
                port: 587,
                secure: false,
                auth: {
                // TODO: insert correct info retrieved from DB
                  user: "titanscfcoordinator@gmail.com",
                  pass: "fltozdphmjwdwbpw"
                }
              });
              
              const mailOptions = {
                // TODO: insert correct info retrieved from DB
                from: '"Amy Cook", "titanscfcoordinator@gmail.com"',
                // to: sendTo,
                to: 'coo17045@byui.edu',
                subject: "Credit Summary - " + name,
                html: "<h4>Titans Dues Reduction Credit Summary.</h4>" +
                      "<div>TUAccount: " + name + "</div>",
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
  
      // no events found, send blank document
      else {

        fillBlankWorksheet(worksheet, accountName, specs.start, specs.end);
        var name = accountName;
  
        //Finally creating XLSX file
        var savedFilePath = "./savedFiles/CreditSummary/CreditSummary_" + name + ".xlsx";
        var savedFileName = "CreditSummary_" + name + ".xlsx";
        workbook.xlsx.writeFile(savedFilePath).then(() => {

            // send files by email
          if(doEmailMember || doEmailCoordinator) {
            var sendTo = "";
              var count = 0;
              if(doEmailMember) {
                console.log("email sent to member: " + memberEmail);
                sendTo += memberEmail;
                count++;
              }
              // TODO: Get coordinators name & email from DB
              if(doEmailCoordinator) {
                console.log("email send to coordinator");
                if(count > 0) {
                  sendTo += '; ';
                }
                sendTo += 'coo17045@byui.edu';
              }

              var transport = nodemailer.createTransport({
                host: "smtp.gmail.com",
                port: 587,
                secure: false,
                auth: {
                  // TODO: insert correct info retrieved from DB
                  user: "titanscfcoordinator@gmail.com",
                  pass: "fltozdphmjwdwbpw"
                }
              });
        
              const mailOptions = {
                // TODO: insert correct info retrieved from DB
                from: '"Amy Cook", "titanscfcoordinator@gmail.com"',
                to: 'coo17045@byui.edu',
                subject: "Credit Summary - " + name,
                html: "<h4>Titans Dues Reduction Credit Summary.</h4>" +
                      "<div>TUAccount: " + name + "</div>",
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
  });
}

function fillWorksheet(worksheet, arr, start, end) {
  sortByDateAscending(arr);

  // HEADER
  var tuCell = worksheet.getCell('A3');
  tuCell.value = "TU Account: " + arr[0].accountName;
  var fromCell = worksheet.getCell('C3');
  fromCell.value = getDate(start);
  var endCell = worksheet.getCell('F3');
  endCell.value = getDate(end);

  // Set title row to wrap text
  worksheet.getCell('A5').alignment = { horizontal: 'center', wrapText: true };
  worksheet.getCell('B5').alignment = { horizontal: 'center', wrapText: true };
  worksheet.getCell('C5').alignment = { horizontal: 'center', wrapText: true };
  worksheet.getCell('D5').alignment = { horizontal: 'center', wrapText: true };
  worksheet.getCell('E5').alignment = { horizontal: 'center', wrapText: true };
  worksheet.getCell('F5').alignment = { horizontal: 'center', wrapText: true };
  worksheet.getCell('G5').alignment = { horizontal: 'center', wrapText: true };
  worksheet.getCell('H5').alignment = { horizontal: 'center', wrapText: true };
  worksheet.getCell('I5').alignment = { horizontal: 'center', wrapText: true };
  worksheet.getCell('J5').alignment = { horizontal: 'center', wrapText: true };

  var resultCellRow = 6;
  var totalCellRow = 8;
  var addRow = 1;
  var lngth = arr.length;
  var totalCredit = 0;

  // add color to every other row

  arr.forEach(res => {
    if(lngth > addRow) {
      // add new row
      worksheet.duplicateRow(resultCellRow, 1, true);
      totalCellRow++;
      addRow++;
    }

    var eventCell = worksheet.getCell('A' + resultCellRow);
    eventCell.value = getDate(res.eventDateTime) + " " + res.title;
    var nameCell = worksheet.getCell('B' + resultCellRow);
    nameCell.value = res.firstName;
    var startCell = worksheet.getCell('C' + resultCellRow);
    startCell.value = getTime(res.timeIn);
    var endCell = worksheet.getCell('D' + resultCellRow);
    endCell.value = getTime(res.timeOut);
    var hoursCell = worksheet.getCell('E' + resultCellRow);
    hoursCell.value = (res.hoursWorked ? res.hoursWorked : 0);
    var rateCell = worksheet.getCell('F' + resultCellRow);
    rateCell.value = (res.hourlyRate ? res.hourlyRate : 0);
    var shBonusCell = worksheet.getCell('G' + resultCellRow);
    shBonusCell.value = (res.shuttleBonus ? res.shuttleBonus : 0);
    var hrBonusCell = worksheet.getCell('H' + resultCellRow);
    hrBonusCell.value = (res.hourlyBonus ? res.hourlyBonus : 0);
    var evBonusCell = worksheet.getCell('I' + resultCellRow);
    evBonusCell.value = (res.eventBonus ? res.eventBonus : 0);
    var creditCell = worksheet.getCell('J' + resultCellRow);
    creditCell.value = (res.creditAmount ? res.creditAmount : 0);



    totalCredit += res.creditAmount;
    resultCellRow++;
  });

  // Set Total Credit
  worksheet.mergeCells('H' + totalCellRow , 'I' + totalCellRow);
  var totTitleCell = worksheet.getCell('H' + totalCellRow);
  totTitleCell.style = { font: { bold: true }};
  totTitleCell.value = "TOTAL Credit:";
  var totalCell = worksheet.getCell('J' + totalCellRow);
  totalCell.alignment = { horizontal: 'right' };
  totalCell.value = totalCredit;
}

function fillBlankWorksheet(worksheet, accountName, start, end) {

  // HEADER
  var tuCell = worksheet.getCell('A3');
  tuCell.value = "TU Account: " + accountName;
  var fromCell = worksheet.getCell('C3');
  fromCell.value = getDate(start);
  var endCell = worksheet.getCell('F3');
  endCell.value = getDate(end);

  // Set title row to wrap text
  worksheet.getCell('A5').alignment = { horizontal: 'center', wrapText: true };
  worksheet.getCell('B5').alignment = { horizontal: 'center', wrapText: true };
  worksheet.getCell('C5').alignment = { horizontal: 'center', wrapText: true };
  worksheet.getCell('D5').alignment = { horizontal: 'center', wrapText: true };
  worksheet.getCell('E5').alignment = { horizontal: 'center', wrapText: true };
  worksheet.getCell('F5').alignment = { horizontal: 'center', wrapText: true };
  worksheet.getCell('G5').alignment = { horizontal: 'center', wrapText: true };
  worksheet.getCell('H5').alignment = { horizontal: 'center', wrapText: true };
  worksheet.getCell('I5').alignment = { horizontal: 'center', wrapText: true };
  worksheet.getCell('J5').alignment = { horizontal: 'center', wrapText: true };

  // add color to every other row

    var eventCell = worksheet.getCell('A6');
    eventCell.value = "No events found for selected dates.";


  // Set Total Credit
  worksheet.mergeCells('H8:I8');
  var totTitleCell = worksheet.getCell('H8');
  totTitleCell.style = { font: { bold: true }};
  totTitleCell.value = "TOTAL Credit:";
  var totalCell = worksheet.getCell('J8');
  totalCell.alignment = { horizontal: 'right' };
  totalCell.value = "0";
}

// create single array from all results returned from DB
function assembleResults(result) {
  var arr = [];
  for(var i = 0; i < result.length; i++) {
    for(var j = 0; j < result[i].length; j++) {
      arr.push(result[i][j]);
    }
  }
  return arr;
}

function getDate(date) {
  var newDate = new Date(date);
  var month = newDate.getMonth() + 1;
  var day = newDate.getDate();
  var year = newDate.getFullYear();
  return month + "-" + day + "-" + year;
}

function getTime(time) {
  var newTime = new Date(time);
  var hour = newTime.getHours();
  var night = "AM";
  if(hour > 12) {
    hour -= 12;
    night = "PM";
  }
  var min = (newTime.getMinutes() < 10 ? '0' : '') + newTime.getMinutes();

  var str = hour + ':' + min + " " + night;
  return str;
}

function sortByDateAscending(events) {
  return events.sort((val1, val2) => {
    return new Date(val1.eventDateTime) - new Date(val2.eventDateTime);
  });
}

function downloadCreditSummary(req, res) {
  fileName = req.query.fileName;

  var filePath = "./savedFiles/CreditSummaryFiles/" + fileName;

  res.download(filePath, fileName, (err) => {
    if(err) {console.log(err);}
    else {res.end();}
  })
}

module.exports = {
  createSummary: createSummary,
  downloadCreditSummary: downloadCreditSummary
}