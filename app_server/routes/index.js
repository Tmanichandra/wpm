// route handlers (a route and its controller) called by app.js
// ====================================

// require Express server and it's Router
const express = require("express");
const router = express.Router();

// import controller module for /location/.. routes
const ctrlLocations = require("../controllers/locations");

// import controller module for other routes (/about, etc)
const ctrlOthers = require("../controllers/others");

// /location/.. routes and required controllers
router.get("/", ctrlLocations.homelist);
router.get("/location", ctrlLocations.locationInfo);
router.get("/location/review/new", ctrlLocations.addReview);

// other routes and required controllers
router.get("/about", ctrlOthers.about);

// router.get(..) added to express.Router() and exported
// so that route is available when this file is required and called
module.exports = router;
