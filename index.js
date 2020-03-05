const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();

// Set up app
app.use(bodyParser.json({limit: '50mb', extended: true}))
  .use(bodyParser.urlencoded({limit: '50mb', extended: true}))
  .use(cors());


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
const emailController = require("./controllers/emailController");

// Routes
app.get('/venues', venueController.getVenues);
app.get('/getSeasons', seasonController.getSeasons);
app.get('/getEvents', eventController.getEvents);
app.get('/getEventsPNC', eventPncController.getEvents);
app.get('/getEventsWC', eventWcController.getEvents);
app.get('/getEventsCF', eventCfController.getEvents);
app.get('/getTimesheetForEvent', eventController.getTimesheetForEvent);
app.get('/getStaffForEvent', staffController.getStaffForEvent);
// app.get('/getAllStaff', staffController.getAllStaff);
app.get('/getAllPncStaff', staffPncController.getAllPncStaff);
app.get('/getAllWcStaff', staffWcController.getAllWcStaff);
app.get('/getAllCfStaff', staffCfController.getAllCfStaff);
app.get('/getContractPnc', eventPncController.getContractPnc);
app.get('/getPncJobs', eventPncController.getPncJobs);


app.post('/oneVenue', venueController.getOneVenue);
app.post('/login', loginController.loginUser);
app.post('/setNewPncEvent', eventPncController.setNewPncEvent);
app.post('/editPncEvent', eventPncController.editPncEvent);
app.post('/deletePncEvent', eventPncController.deletePncEvent);
app.post('/sendGateList', emailController.sendGateList);
app.post('/updateOneTimesheet', eventController.updateTimesheet);

// Create port
const port = process.env.PORT || 4000;

// const port = 8081;

app.listen(port, () => {
  console.log('Connected to port ' + port);
});
