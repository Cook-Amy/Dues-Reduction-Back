const creditSummaryModel = require('../model/creditSummaryModel');
const nodemailer = require('nodemailer');
const ExcelJS = require('exceljs');

function createSummary(req, res, next) {
  var specs = req.body.specs;

  creditSummaryModel.getTuAccountFromDB(specs.staffID, specs.start, specs.end, function reportCallback(error, result, accountName) {

    var workbook = new ExcelJS.Workbook();
    var filename = "./savedFiles/TemplateCreditSummary.xlsx";
    workbook.xlsx.readFile(filename).then(() => {
      console.log("File read");
  
      // edit worksheet
      var worksheet = workbook.getWorksheet('Sheet1');
      var arr = assembleResults(result);

      // if events found in DB
      if(arr.length > 0) {
        fillWorksheet(worksheet, arr, specs.start, specs.end);
        var name = accountName;
  
        //Finally creating XLSX file
        var savedFileName = "./savedFiles/CreditSummary_" + name + ".xlsx";
        workbook.xlsx.writeFile(savedFileName).then(() => {
            console.log("File saved");
    
          var transport = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 587,
            secure: false,
            auth: {
              user: "titanscfcoordinator@gmail.com",
              pass: "fltozdphmjwdwbpw"
            }
          });
    
          const mailOptions = {
            from: '"Amy Cook", "titanscfcoordinator@gmail.com"',
            to: 'coo17045@byui.edu',
            subject: "Credit Summary - " + name,
            html: "<h1>This is a test email.</h1>",
            attachments: [
              {
                filename: "CreditSummary_" + name + ".xlsx",
                path: "./savedFiles/CreditSummary_" + name + ".xlsx"
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
              res.send(info);
              res.end();
            }
          });
        }).catch(e => console.log("Catch: " + e));;
      }
  
      // no events found, send blank document
      else {

        fillBlankWorksheet(worksheet, accountName, specs.start, specs.end);
        var name = accountName;
  
        //Finally creating XLSX file
        var savedFileName = "./savedFiles/CreditSummary_" + name + ".xlsx";
        workbook.xlsx.writeFile(savedFileName).then(() => {
            console.log("File saved");
    
          var transport = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 587,
            secure: false,
            auth: {
              user: "titanscfcoordinator@gmail.com",
              pass: "fltozdphmjwdwbpw"
            }
          });
    
          const mailOptions = {
            from: '"Amy Cook", "titanscfcoordinator@gmail.com"',
            to: 'coo17045@byui.edu',
            subject: "Credit Summary - " + name,
            html: "<h1>This is a test email.</h1>",
            attachments: [
              {
                filename: "CreditSummary_" + name + ".xlsx",
                path: "./savedFiles/CreditSummary_" + name + ".xlsx"
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
              res.send(info);
              res.end();
            }
          });
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

module.exports = {
  createSummary: createSummary
}