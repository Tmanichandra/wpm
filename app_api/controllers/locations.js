// API controllers for locations collection,
// used by API routes/index.js as "ctrlLocations" variable

// defines API Controller functions used by API Routes,
// which access Mongoose API Models (who talk to the MongoDB)

// connect controller to Mongoose
const mongoose = require("mongoose");
// connect to the Mongoose model for "locations" collection
const Loc = mongoose.model("Location");

// ==============================================================================

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

// ==============================================================================

// POST /locations
const locationsCreate = (req, res) => {
  // call .create() on the document model
  Loc.create(
    // .create() first arg: document data object
    {
      // note: no rating set (intial value of 0, calculated from all ratings average)
      name: req.body.name,
      address: req.body.address,
      // create array from a CSV string
      facilities: req.body.facilities.split(","),
      // parse lng/lat String values into Floats
      coords: [parseFloat(req.body.lng), parseFloat(req.body.lat)],
      openingTimes: [
        {
          days: req.body.days1,
          opening: req.body.opening1,
          closing: req.body.closing1,
          closed: req.body.closed1
        },
        {
          days: req.body.days2,
          opening: req.body.opening2,
          closing: req.body.closing2,
          closed: req.body.closed2
        },
        {
          days: req.body.days3,
          opening: req.body.opening3,
          closing: req.body.closing3,
          closed: req.body.closed3
        }
      ]
    },
    // .create() second arg: callback(error, documentCreatedInDB)
    (err, location) => {
      if (err) {
        res.status(400).json(err);
      } else {
        res.status(201).json(location);
      }
    }
  );
};

// ==============================================================================

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

// ==============================================================================

// PUT /locations/:locationid
const locationsUpdateOne = (req, res) => {
  // perform initial check to make sure a locationid was in the API URL
  if (!req.params.locationid) {
    // return out of controller function and res a "not found" message back
    return res.status(404).json({ message: "Location not found, locationid is required" });
  }
  // but if locationid provided, good to go--keep going, do a .findById() on it
  Loc.findById(req.params.locationid)
    // and this time -IGNORE (don't retrieve) "reviews" and "rating" data from document
    // for less data transfer (and shorter to tell it what we DON'T want with this operation)
    .select("-reviews -rating")
    // then run .exec() to do what you wanna do .exec(error, documentData) {}
    .exec((err, location) => {
      if (!location) {
        // if no location with that locationid is found, return a message
        return res.status(404).json({ message: "locationid not found" });
      } else if (err) {
        // or if there was an error, return the error
        return res.status(400).json(err);
      }
      // and if it passes those checks, set your desired data changes
      location.name = req.body.name;
      location.address = req.body.address;
      location.facilities = req.body.facilities.split(",");
      location.coords = [parseFloat(req.body.lng), parseFloat(req.body.lat)];
      location.openingTimes = [
        {
          days: req.body.days1,
          opening: req.body.opening1,
          closing: req.body.closing1,
          closed: req.body.closed1
        },
        {
          days: req.body.days2,
          opening: req.body.opening2,
          closing: req.body.closing2,
          closed: req.body.closed2
        }
      ];
      // and then do a .save() to send those data changes back to the db
      location.save((err, location) => {
        if (err) {
          res.status(404).json(err);
        } else {
          res.status(200).json(location);
        }
      });
    });
};

// ==============================================================================

// DELETE /locations/:locationid
const locationsDeleteOne = (req, res) => {
  // destructure var for req.params.locationid from API URL
  const { locationid } = req.params;
  // as long as locationid has a value sent,
  if (locationid) {
    // pass it to Mongoose's combo Find AND Remove method
    Loc.findByIdAndRemove(locationid)
      // and execute the delete method with a callback
      .exec((err, location) => {
        // if error (can't find the document with that _id)
        if (err) {
          return res.status(404).json(err);
        }
        // otherwise if no error, return 204 with "null" data returned
        res.status(204).json(null);
      });
  } else {
    // but if locationid value has not been sent in the API URL
    res.status(404).json({ message: "No location id provided." });
  }
};

// ==============================================================================

// export controller functions for use as methods
// of ctrlLocations in API routes/index.js
module.exports = {
  locationsListByDistance,
  locationsCreate,
  locationsReadOne,
  locationsUpdateOne,
  locationsDeleteOne
};
