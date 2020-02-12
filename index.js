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

// Routes
app.get('/venues', venueController.getVenues);

app.post('/oneVenue', venueController.getOneVenue);
app.post('/login', loginController.loginUser);

// Create port
const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log('Connected to port ' + port);
});
