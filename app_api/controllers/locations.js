// API controllers for locations collection,
// used by API routes/index.js as "ctrlLocations" variable

// defines API Controller functions used by API Routes,
// which access Mongoose API Models (who talk to the MongoDB)

// connect controller to Mongoose
const mongoose = require("mongoose");
// connect to the Mongoose model for "locations" collection
const Loc = mongoose.model("Location");

// GET /locations
const locationsListByDistance = async (req, res) => {
  // convert lng and lat from String to Float
  const lng = parseFloat(req.query.lng);
  const lat = parseFloat(req.query.lat);
  // construct geoJSON point from (numberfied) lng, lat
  const point = {
    type: "Point",
    coordinates: [lng, lat]
  };
  // define $geoNear options for db query
  const geoOptions = {
    distanceField: "distance.calculated", // object property name for distance data
    key: "coords", // use secondary "coords" key for faster db query results
    spherical: true, // matches Location model, where { coords: "2dsphere" }
    maxDistance: 20000, // meters, so 20,000m is 20km
    limit: 10 // either "num" or "limit" (max # results returned)
  };
  // error handler: if either lng or lat is not provided, then RETURN with message
  if (!lng || !lat) {
    return res.status(404).json({ message: "both lng and lat query parameters are required" });
  }
  // use a try/catch block to execute an async/await function's query
  try {
    // $geoNear db query, results is an array of documents
    // use "await" to pause function until Promise resolves and "results" data returned
    const results = await Loc.aggregate([
      {
        $geoNear: {
          near: point, // geoJSON point containing lng, lat
          ...geoOptions // (rest operator) all other query options
        }
      }
    ]);
    // console.log(results);
    // after "results" data is set, "await" allows code execution below to continue
    // map() results (all document data) to return only needed document paths data
    const locations = results.map(result => {
      return {
        _id: result._id,
        name: result.name,
        address: result.address,
        rating: result.rating,
        facilities: result.facilities,
        distance: `${result.distance.calculated.toFixed()}m` // round to whole meters
      };
    });
    // console.log(locations);
    // return "locations", an array of specific mapped data of all documents returned
    return res.status(200).json(locations);
  } catch (err) {
    console.log(err);
    res.status(404).json(err);
  }
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
