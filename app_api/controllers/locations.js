// API controllers for locations collection,
// used by API routes/index.js as "ctrlLocations" variable

// defines API Controller functions used by API Routes,
// which access Mongoose API Models (who talk to the MongoDB)

// connect controller to Mongoose
const mongoose = require("mongoose");
// connect to the Mongoose model for "locations" collection
const Loc = mongoose.model("Location");

// GET /locations
const locationsListByDistance = (req, res) => {
  // placeholder response, until connected to db
  res.status(200).json({ status: "success" });
};

// post() /locations
const locationsCreate = (req, res) => {
  // placeholder response, until connected to db
  res.status(200).json({ status: "success" });
};

// GET /locations/:locationid
const locationsReadOne = (req, res) => {
  Loc
    // req.params contains data from URL parameters
    .findById(req.params.locationid)
    // execute query with .exec() with callback to handle response and create result (res)
    .exec((err, location) => {
      // conditionals for error handling:
      if (!location) {
        // if no (location) data returned, return (exit) and res JSON message
        return res.status(404).json({ message: "location not found" });
      } else if (err) {
        // or if an error occurred, return (exit) and res JSON error
        return res.status(404).json(err);
      }
      // otherwise, res status and JSON data, (location) is data returned from query
      res.status(200).json(location);
    });
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
