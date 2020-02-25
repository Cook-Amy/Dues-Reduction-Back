const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();

// Set up app
app.use(bodyParser.json())
  .use(bodyParser.urlencoded({extended: false}))
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


app.post('/oneVenue', venueController.getOneVenue);
app.post('/login', loginController.loginUser);
app.post('/setNewPncEvent', eventPncController.setNewPncEvent);

// Create port
const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log('Connected to port ' + port);
});
