// API controllers for locations collection,
// used by API routes/index.js as "ctrlLocations" variable

// connect controller to Mongoose
const mongoose = require("mongoose");
// connect to the Mongoose model for "locations" collection
const Loc = mongoose.model("Location");

// get() /locations
const locationsListByDistance = (req, res) => {
  // placeholder response, until connected to db
  res.status(200).json({ status: "success" });
};

// post() /locations
const locationsCreate = (req, res) => {
  // placeholder response, until connected to db
  res.status(200).json({ status: "success" });
};

// get() /locations/:locationid
const locationsReadOne = (req, res) => {
  // placeholder response, until connected to db
  res.status(200).json({ status: "success" });
};

// put() /locations/:locationid
const locationsUpdateOne = (req, res) => {
  // placeholder response, until connected to db
  res.status(200).json({ status: "success" });
};

// delete() /locations/:locationid
const locationsDeleteOne = (req, res) => {
  // placeholder response, until connected to db
  res.status(200).json({ status: "success" });
};

// export controller functions for use as methods
// of ctrlLocations in API routes/index.js
module.exports = {
  locationsListByDistance,
  locationsCreate,
  locationsReadOne,
  locationsUpdateOne,
  locationsDeleteOne
};
