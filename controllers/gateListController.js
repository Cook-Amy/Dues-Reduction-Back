const nodemailer = require('nodemailer');
const ExcelJS = require('exceljs');
const fs = require('fs');

/*************************************************************
 * PNC Gate List
*************************************************************/

function sendPncGateList(req, res) {
  var event = req.body.event;
  var staff = req.body.staff;
  var data = setDataPnc(staff);

  var email = req.body.email;
  var download = req.body.download;

  //TODO: get email addresses from DB
  
  var workbook = new ExcelJS.Workbook();
  var filename = "./savedFiles/Templates/TemplateGateListPnc.xlsx";
  workbook.xlsx.readFile(filename).then(() => {

    // edit worksheet
    var worksheet = workbook.getWorksheet('Sheet1');

    worksheet = fillWorksheet(worksheet, event, data);

    //Finally creating XLSX file
    var savedFilePath = "./savedFiles/GateList/GateList_PNC_" + event.Title +".xlsx";
    var savedFileName = "GateList_PNC_" + event.Title + ".xlsx";
    workbook.xlsx.writeFile(savedFilePath).then(() => {

      // send report by email
      if(email) {
        var transport = nodemailer.createTransport({
          host: "smtp.gmail.com",
          port: 587,
          secure: false,
          auth: {
            // TODO: insert correct info
            user: "titanscfcoordinator@gmail.com",
            pass: "fltozdphmjwdwbpw"
          }
        });
  
        const mailOptions = {
          // TODO: insert correct info
          from: '"Amy Cook", "titanscfcoordinator@gmail.com"',
          to: 'coo17045@byui.edu',
          subject: "Gate List - " + event.Title,
          html: "<h1>Gate List for TAC Titans.</h1>" +
                "<div>Event: " + event.Title + "</div>",
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
            // download report
            if(download) {
              res.download(savedFilePath, savedFileName, (err) => {
                if(err) { console.log(err); }
                else { 
                  fs.unlink(savedFilePath, function (err) {
                    if(err) {throw err;}
                    else {res.end();}
                  }); 
                 }
              });
            }
            // don't download report
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

      // only download report; no email sent
      else{
        res.download(savedFilePath, savedFileName, (err) => {
          if(err) { console.log(err); }
          else {
            fs.unlink(savedFilePath, function (err) {
              if(err) {throw err;}
              else {res.end();}
            }); 
          }
        });
      }

      // TODO: Delete file from here after done
      
    }).catch(e => console.log("Catch: " + e));;
  }).catch(e => console.log("Catch: " + e));
}


function setDataPnc(staff) {
  var data = [];
  staff.forEach(res => {
    data.push([
      res.Name,
      res.jobName,
      getTime(res.scheduledArrivalTime),
      getExperienced(res.pncExperienced),
      getExperienced2(res.pncExperienced),
      getBars(res.pncBars),
      getBars2(res.pncBars),
      getHealth(res.pncHealthForm),
      getHealth2(res.pncHealthForm),
      getWaiver(res.pncWaiver),
      getWaiver2(res.pncWaiver),
      'a', '',
      getRefresher(res.pncBarsRefresher),
      getRefresher2(res.pncBarsRefresher)
    ]);
  });
  return data;
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

function getExperienced(ex) {
  if(ex == 1) { return 'a'; }
  else { return ''; }
}
function getExperienced2(ex) {
  if(ex == 0) { return 'a'; }
  else { return ''; }
}

function getBars(bars) {
  if(bars) { return 'a'; }
  else { return ''; }
}
function getBars2(bars) {
  if(!bars) { return 'a'; }
  else { return ''; }
}

function getHealth(health) {
  if(health == 1) { return 'a'; }
  else { return ''; }
}
function getHealth2(health) {
  if(health == 0) { return 'a'; }
  else { return ''; }
}

function getWaiver(waiver) {
  if(waiver == 1) { return 'a'; }
  else { return ''; }
}
function getWaiver2(waiver) {
  if(waiver == 0) { return 'a'; }
  else { return ''; }
}

function getRefresher(ref) {
  if(ref == 1) { return 'a'; }
  else { return ''; }
}
function getRefresher2(ref) {
  if(ref == 0) { return 'a'; }
  else { return ''; }
}

function getDate(date) {
  var newDate = new Date(date);
  var month = newDate.getMonth() + 1;
  var day = newDate.getDate();
  var year = newDate.getFullYear();
  return month + "-" + day + "-" + year;
}

function fillWorksheet(worksheet, event, data) {

  // HEADER
  var dateCell = worksheet.getCell('D3');
  dateCell.value = getDate(event.Date);
  var eventCell = worksheet.getCell('H3');
  eventCell.value = event.Title;
  var standCell = worksheet.getCell('D4');
  standCell.value = event.location;

  // TODO: How to distinguish between stand and cart

  // ROW OF VOLUNTEERS
  var nameCell = ['A11', 'A12', 'A13', 'A14', 'A15', 'A16', 'A17', 'A18', 'A19', 'A20', 'A21', 'A22', 'A23', 'A24', 'A25', 'A26', 'A27', 'A28', 'A29', 'A30'];
  var positionCell = ['B11', 'B12', 'B13', 'B14', 'B15', 'B16', 'B17', 'B18', 'B19', 'B20', 'B21', 'B22', 'B23', 'B24', 'B25', 'B26', 'B27', 'B28', 'B29', 'B30'];
  var arrivalTimeCell = ['C11', 'C12', 'C13', 'C14', 'C15', 'C16', 'C17', 'C18', 'C19', 'C20', 'C21', 'C22', 'C23', 'C24', 'C25', 'C26', 'C27', 'C28', 'C29', 'C30'];
  var experienced1Cell = ['D11', 'D12', 'D13', 'D14', 'D15', 'D16', 'D17', 'D18', 'D19', 'D20', 'D21', 'D22', 'D23', 'D24', 'D25', 'D26', 'D27', 'D28', 'D29', 'D30'];
  var experienced2Cell = ['E11', 'E12', 'E13', 'E14', 'E15', 'E16', 'E17', 'E18', 'E19', 'E20', 'E21', 'E22', 'E23', 'E24', 'E25', 'E26', 'E27', 'E28', 'E29', 'E30'];
  var bars1Cell = ['F11', 'F12', 'F13', 'F14', 'F15', 'F16', 'F17', 'F18', 'F19', 'F20', 'F21', 'F22', 'F23', 'F24', 'F25', 'F26', 'F27', 'F28', 'F29', 'F30'];
  var bars2Cell = ['G11', 'G12', 'G13', 'G14', 'G15', 'G16', 'G17', 'G18', 'G19', 'G20', 'G21', 'G22', 'G23', 'G24', 'G25', 'G26', 'G27', 'G28', 'G29', 'G30'];
  var health1Cell = ['H11', 'H12', 'H13', 'H14', 'H15', 'H16', 'H17', 'H18', 'H19', 'H20', 'H21', 'H22', 'H23', 'H24', 'H25', 'H26', 'H27', 'H28', 'H29', 'H30'];
  var health2Cell = ['I11', 'I12', 'I13', 'I14', 'I15', 'I16', 'I17', 'I18', 'I19', 'I20', 'I21', 'I22', 'I23', 'I24', 'I25', 'I26', 'I27', 'I28', 'I29', 'I30'];
  var waiver1Cell = ['J11', 'J12', 'J13', 'J14', 'J15', 'J16', 'J17', 'J18', 'J19', 'J20', 'J21', 'J22', 'J23', 'J24', 'J25', 'J26', 'J27', 'J28', 'J29', 'J30'];
  var waiver2Cell = ['K11', 'K12', 'K13', 'K14', 'K15', 'K16', 'K17', 'K18', 'K19', 'K20', 'K21', 'K22', 'K23', 'K24', 'K25', 'K26', 'K27', 'K28', 'K29', 'K30'];
  var age1Cell = ['L11', 'L12', 'L13', 'L14', 'L15', 'L16', 'L17', 'L18', 'L19', 'L20', 'L21', 'L22', 'L23', 'L24', 'L25', 'L26', 'L27', 'L28', 'L29', 'L30'];
  var age2Cell = ['M11', 'M12', 'M13', 'M14', 'M15', 'M16', 'M17', 'M18', 'M19', 'M20', 'M21', 'M22', 'M23', 'M24', 'M25', 'M26', 'M27', 'M28', 'M29', 'M30'];
  var refresher1Cell = ['N11', 'N12', 'N13', 'N14', 'N15', 'N16', 'N17', 'N18', 'N19', 'N20', 'N21', 'N22', 'N23', 'N24', 'N25', 'N26', 'N27', 'N28', 'N29', 'N30'];
  var refresher2Cell = ['O11', 'O12', 'O13', 'O14', 'O15', 'O16', 'O17', 'O18', 'O19', 'O20', 'O21', 'O22', 'O23', 'O24', 'O25', 'O26', 'O27', 'O28', 'O29', 'O30'];

  var num = 0;
  data.forEach(d => {
    worksheet.getCell(nameCell[num]).value = d[0];
    worksheet.getCell(positionCell[num]).value = d[1];
    worksheet.getCell(arrivalTimeCell[num]).value = d[2];
    worksheet.getCell(experienced1Cell[num]).value = d[3];
    worksheet.getCell(experienced2Cell[num]).value = d[4];
    worksheet.getCell(bars1Cell[num]).value = d[5];
    worksheet.getCell(bars2Cell[num]).value = d[6];
    worksheet.getCell(health1Cell[num]).value = d[7];
    worksheet.getCell(health2Cell[num]).value = d[8];
    worksheet.getCell(waiver1Cell[num]).value = d[9];
    worksheet.getCell( waiver2Cell[num]).value = d[10];
    worksheet.getCell( age1Cell[num]).value = d[11];
    worksheet.getCell( age2Cell[num]).value = d[12];
    worksheet.getCell( refresher1Cell[num]).value = d[13];
    worksheet.getCell( refresher2Cell[num]).value = d[14];
    num++;
  });

  return worksheet;
}

/*************************************************************
 * WC Gate List
*************************************************************/
function sendWcGateList(req, res) {
  var event = req.body.event;
  var staff = req.body.staff;
  var email = req.body.email;
  var download = req.body.download;

  //TODO: get email addresses from DB
  
  var workbook = new ExcelJS.Workbook();
  var filename = "./savedFiles/Templates/TemplateGateListWc.xlsx";
  workbook.xlsx.readFile(filename).then(() => {

    // edit worksheet
    var worksheet = workbook.getWorksheet('Sheet1');

    fillWorksheet2(worksheet, event, staff);

    //Finally creating XLSX file
    var savedFilePath = "./savedFiles/GateList/GateList_WC_" + event.Title +".xlsx";
    savedFileName = "GateList_WC_" + event.Title + ".xlsx";
    workbook.xlsx.writeFile(savedFilePath).then(() => {

        // send report by email
        if(email) {
          var transport = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 587,
            secure: false,
            auth: {
              // TODO: insert correct info
              user: "titanscfcoordinator@gmail.com",
              pass: "fltozdphmjwdwbpw"
            }
          });
    
        const mailOptions = {
          // TODO: insert correct info
          from: '"Amy Cook", "titanscfcoordinator@gmail.com"',
          to: 'coo17045@byui.edu',
          subject: "Gate List - " + event.Title,
          html: "<h4>Gate List for TAC Titans.</h4>" +
                "<div>Event: " + event.Title + "</div>",
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
            // download report
            if(download) {
              res.download(savedFilePath, savedFileName, (err) => {
                if(err) { console.log(err); }
                else { 
                  fs.unlink(savedFilePath, function (err) {
                    if(err) {throw err;}
                    else {res.end();}
                  }); 
                 }
              });
            }
            // don't download report
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

      // only download report; no email sent
      else {
        res.download(savedFilePath, savedFileName, (err) => {
          if(err) { console.log(err); }
          else { 
            fs.unlink(savedFilePath, function (err) {
              if(err) {throw err;}
              else {res.end();}
            }); 
           }
        });
      }

      // TODO: Delete file from here after done

    }).catch(e => console.log("Catch: " + e));;
  }).catch(e => console.log("Catch: " + e));
}

function fillWorksheet2(worksheet, event, staff) {

  // HEADER
  var dateCell = worksheet.getCell('B2');
  dateCell.value = getDate(event.Date);
  var eventCell = worksheet.getCell('D2');
  eventCell.value = event.Title;

  // ROW OF VOLUNTEERS
  var nameCell = ['B5', 'B6', 'B7', 'B8', 'B9', 'B10', 'B11', 'B12', 
                  'B13', 'B14', 'B15', 'B16', 'B17', 'B18', 'B19', 
                  'B20', 'B21', 'B22', 'B23', 'B24', 'B25', 'B26', 
                  'B27', 'B28', 'B29', 'B30', 'B31', 'B32', 'B33', 'B34'];


  var num = 0;
  staff.forEach(st => {
    worksheet.getCell(nameCell[num]).value = st.Name;
    num++;
  });
}

module.exports = {
  sendPncGateList: sendPncGateList,
  sendWcGateList: sendWcGateList
}