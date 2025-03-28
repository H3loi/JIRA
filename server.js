const express = require("express");
const cors = require("cors");
const bodyParser = require('body-parser');
const db = require("./app/models");

const applicantRoutes = require('./app/routes/applicantroutes');
const countRoutes = require('./app/routes/count.routes');
const eventRoutes = require('./app/routes/event.routes');
const notificationRoutes = require("./app/routes/notification.routes");
const adminRoutes = require("./app/routes/admin.routes");
const app = express();

var corsOptions = {
  origin: "http://localhost:8081"
};

app.use(cors(corsOptions));
app.use(bodyParser.json());

// parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

//API routes
app.use('/api/applicants', applicantRoutes);
app.use('/api/event', eventRoutes);
app.use('/api/notification', notificationRoutes);
app.use('/api', countRoutes);
app.use('/api/user', adminRoutes);

const User = db.user; 
// simple route
app.get('/api/auth/signin', async (req, res) => {
  try{
  const users = await User.findOne();
  res.json(users);
  } catch (err) {
  console.error("DATABASE ERROR:", err);
  res.status(500).json({ error: err.message });
  }
});

// routes
require('./app/routes/auth.routes')(app);

// set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});