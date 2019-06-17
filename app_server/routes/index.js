// main route handlers (a route and its controller) called by app.js
// =================================================================

// require Express server and it's Router
const express = require("express");
const router = express.Router();

// import controller module for /location/.. routes
const ctrlLocations = require("../controllers/locations");

// import controller module for other routes (/about, etc)
const ctrlOthers = require("../controllers/others");

// using router.get() syntax implies this route will ALWAYS use a GET method (etc)
router.get("/", ctrlLocations.homelist); // list of all locations
router.get("/location/:locationid", ctrlLocations.locationInfo); // a location's details

// use router.route() syntax when using more than one HTTPRequest method on a route
router
  .route("/location/:locationid/review/new")
  .get(ctrlLocations.addReview) // review a location
  .post(ctrlLocations.doAddReview); // review a location

// other routes and required controllers
router.get("/about", ctrlOthers.about); // about page

// router.get(..) added to express.Router() and exported
// so that route is available when this file is required and called
module.exports = router;
