const nodemailer = require('nodemailer');
const ExcelJS = require('exceljs');

function sendGateList(req, res) {
  var event = req.body.event;
  var staff = req.body.staff;
  var data = setData(staff);
  
  var workbook = new ExcelJS.Workbook();
  var filename = "./savedFiles/TemplateGateList.xlsx";
  workbook.xlsx.readFile(filename).then(() => {
    console.log("File read");

    // edit worksheet
    var worksheet = workbook.getWorksheet('Sheet1');

    var dateCell = worksheet.getCell('D3');
    dateCell.value = getDate(event.Date);
    var eventCell = worksheet.getCell('H3');
    eventCell.value = event.Title;
    var standCell = worksheet.getCell('D4');
    standCell.value = event.location;



      //Finally creating XLSX file
    var savedFileName = "./savedFiles/GateList.xlsx";
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
        subject: "Gate List - " ,
        html: "<h1>This is a test email.</h1>",
        attachments: [
          {
            filename: 'GateList.xlsx',
            path: './savedFiles/GateList.xlsx'
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
        }
      });


    }).catch(e => console.log("Catch: " + e));;
  }).catch(e => console.log("Catch: " + e));
}


function setData(staff) {
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
  return month + "/" + day + "/" + year;
}


module.exports = {
  sendGateList: sendGateList
}