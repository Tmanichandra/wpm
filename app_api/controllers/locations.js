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
    // pass query method the data at the /:locationid portion of HTTP path
    .findById(req.params.locationid)
    // then execute the query with a callback function to run
    // after .exec(error, queryReturnData) runs the preceeding query
    .exec((err, location) => {
      // the callback function takes the data returned from query (location)
      // and sets that (location) data as the .json() data value of res,
      // and also sets (200) as as successful result HTTP status code
      res
        .status(200)
        .json(location);
    })  
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
