const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const path = require('path');

// Set up app
app.use(bodyParser.json({limit: '50mb', extended: true}))
  .use(bodyParser.urlencoded({limit: '50mb', extended: true}))
  .use(cors())
  .use('/images', express.static(path.join(__dirname, 'images')));


// Controller pages
const venueController = require("./controllers/venueController");
const loginController = require("./controllers/loginController");
const seasonController = require("./controllers/seasonController");
const eventController = require("./controllers/eventController");
const eventPncController = require("./controllers/eventPncController");
const eventWcController = require("./controllers/eventWcController");
const eventCfController = require("./controllers/eventCfController");
const staffController = require("./controllers/staffController");
const staffPncController = require("./controllers/staffPncController");
const staffWcController = require("./controllers/staffWcController");
const staffCfController = require("./controllers/staffCfController");
const gateListController = require("./controllers/gateListController");
const reminderController = require("./controllers/reminderController");
const creditSummaryController = require("./controllers/creditSummaryController");
const monthReportController = require('./controllers/monthReportController');
const fileController = require("./controllers/fileController");
const userController = require("./controllers/userController");

/*************************************************************
 * GET Routes
 *************************************************************/
// All
app.get('/venues', venueController.getVenues);
app.get('/getSeasons', seasonController.getSeasons);
app.get('/getEvents', eventController.getEvents);
app.get('/getTimesheetForEvent', eventController.getTimesheetForEvent);
app.get('/getStaffForEvent', staffController.getStaffForEvent);
app.get('/getAllStaff', staffController.getAllStaff);
app.get('/getCalendarEvents', eventController.getCalendarEvents);
app.get('/downloadCreditSummary', creditSummaryController.downloadCreditSummary);
app.get('/getFiles', fileController.getFiles);
// PNC
app.get('/getEventsPNC', eventPncController.getEvents);
app.get('/getAllPncStaff', staffPncController.getAllPncStaff);
app.get('/getActivePncStaff', staffPncController.getActivePncStaff);
app.get('/getContractPnc', eventPncController.getContractPnc);
app.get('/getPncJobs', eventPncController.getPncJobs);
// WC
app.get('/getEventsWC', eventWcController.getEvents);
app.get('/getAllWcStaff', staffWcController.getAllWcStaff);
app.get('/getActiveWcStaff', staffWcController.getActiveWcStaff);
app.get('/getContractWc', eventWcController.getContractWc);
app.get('/getWcJobs', eventWcController.getWcJobs);
// CF
app.get('/getEventsCF', eventCfController.getEvents);
app.get('/getAllCfStaff', staffCfController.getAllCfStaff);
app.get('/getActiveCfStaff', staffCfController.getActiveCfStaff);
app.get('/getContractCf', eventCfController.getContractCf);
app.get('/getCfJobs', eventCfController.getCfJobs);

/*************************************************************
 * POST Routes
 *************************************************************/
// All
app.post('/login', loginController.loginUser);
app.post('/oneVenue', venueController.getOneVenue);
app.post('/updateOneTimesheet', eventController.updateTimesheet);
app.post('/addTimesheet', eventController.addTimesheet);
app.post('/updateAllTimesheets', eventController.updateAllTimesheets);
app.post('/deleteTimesheet', eventController.deleteOneTimesheet);
app.post('/addNewStaff', staffController.addOneStaff);
app.post('/updateStaff', staffController.updateOneStaff);
app.post('/deleteEvent', eventController.deleteOneEvent);
app.post('/editEvent', eventController.editOneEvent);
app.post('/setNewEvent', eventController.setNewEvent);
app.post('/removeStaff', staffController.removeStaff);
app.post('/sendPncReminderEmail', reminderController.sendPncReminder);
app.post('/sendWcReminderEmail', reminderController.sendWcReminder);
app.post('/sendCfReminderEmail', reminderController.sendCfReminder);
app.post('/generateCreditSummary', creditSummaryController.createSummary);
app.post('/getMonthReportData', monthReportController.createReport);
app.post('/removeFile', fileController.removeFile);
app.post('/saveFile', fileController.saveFile);
app.post('/changeSettings', userController.changeSettings);
// PNC
app.post('/setNewPncEvent', eventPncController.setNewPncEvent);
app.post('/editPncEvent', eventPncController.editPncEvent);
app.post('/deletePncEvent', eventPncController.deletePncEvent);
app.post('/sendPncGateList', gateListController.sendPncGateList);
// WC
app.post('/setNewWcEvent', eventWcController.setNewWcEvent);
app.post('/editWcEvent', eventWcController.editWcEvent);
app.post('/deleteWcEvent', eventWcController.deleteWcEvent);
app.post('/sendWcGateList', gateListController.sendWcGateList);
// CF
app.post('/setNewCfEvent', eventCfController.setNewCfEvent);
app.post('/editCfEvent', eventCfController.editCfEvent);
app.post('/deleteCfEvent', eventCfController.deleteCfEvent);


// Create port
const port = process.env.PORT || 4000;

app.listen(port, () => {
  console.log('Connected to port ' + port);
});
