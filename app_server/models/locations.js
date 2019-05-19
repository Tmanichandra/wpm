// this file required by db.js to expose it to Express (and the app)
// Mongoose Schema file for Loc8r wifi locations

// require Mongoose to use its methods for Schema definition
// no pathname needed for required node_modules
const mongoose = require("mongoose");

// create and define the Schema for locations.js
// refer to FPO data in the controller, moved back from views during dev process
const locationSchema = new mongoose.Schema({
  // name of location is required
  name: {
    type: String,
    required: true
  },
  // address of location
  address: String,
  // number of stars given for rating, 0 to 5, default 0
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  // defining facilities as an Array that will only contain String elements
  facilities: [String],
  // long/lat coords in GeoJSON format
  coords: {
    // ?
    type: { type: String },
    // coordinates are an array of Numbers (long: -180 to 180, lat: -90 to 90)
    coordinates: [Number]
  }
});

// make the coords: path an INDEX in locationSchema to speed up coordinate-based queries
// "2dsphere" allows long/lat calculations on coordinate queries
locationSchema.index({ coords: "2dsphere" });
