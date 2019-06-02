// this file required by db.js to expose it to Express (and the app)
// Mongoose Schema file for Loc8r wifi locations

// require Mongoose to use its methods for Schema definition
// no pathname needed for required node_modules
const mongoose = require("mongoose");

// MongoDB uses "Subdocument Schema" as NoSQL alternative to relational db "Joins"
// subdoc schema must be included in same file as, and before, their parent schema
// subdoc schema objects have their own individual ObjectId,
// and are included as Array properties in the main parent schemas

// ==================================================
// LOCATION HOURS SUBDOCUMENT SCHEMA
// NOTE: subdocument schema must come BEFORE main document Schema
// separate so it can be added to location-info, but not in locations-list
// ==================================================

// based on additional FPO data in locationInfo controller for location detail view
// each location can have multiple object instances of this group of data,
// with one object for each day or group of days, i.e. [ {Mon-Fri}, {Sat}, {Sun} ]
const openingTimeSchema = new mongoose.Schema({
  // _id: ObjectId(..) automatically generated
  // day or group of days that times refer to
  days: {
    type: String,
    required: true
  },
  // if closed: false, then will display opening: - closing: times
  opening: String,
  closing: String,
  // if closed: true, then no opening: and closing: times, will display "Closed"
  closed: {
    type: Boolean,
    required: true
  }
});

// ==================================================
// REVIEWS SUBDOCUMENT SCHEMA
// NOTE: subdocument schema must come BEFORE main document Schema
// separate so it can be added in location-review-form, and included on location-info
// ==================================================

// subdocument schema for reviews to include in the main locationSchema
const reviewSchema = new mongoose.Schema({
  // _id: ObjectId(..) automatically generated
  // author's name
  author: String,
  // author's rating of location
  rating: {
    type: Number,
    required: true,
    min: 0,
    max: 5
  },
  // text of author's review of location
  reviewText: String,
  // no manual create date entry, so automatic timestamped
  createdOn: {
    type: Date,
    default: Date.now
  }
});

// ==================================================
// MAIN DOCUMENT SCHEMA : BASIC LOCATION INFO
// ==================================================

// define the Schema for the Location model ("locations" collection in MongoDB)
// based on FPO data in the controller, moved back from views during dev process
const locationSchema = new mongoose.Schema({
  // _id: ObjectId(..) automatically generated
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
  // long/lat coords in a GeoJSON pair format, sample data:
  // "coords": [-0.9690884, 51.455041]
  coords: {
    type: [Number], // String data needs to be parseFloat() converted
    index: "2dsphere" // make coords: an index, and set "2dsphere" for geoNear calculations
  },
  // USE openingTimesSchema subdocument Schema
  // Array can include multiple objects for days/day groups of opening/closing times
  openingTimes: [openingTimeSchema],
  // USE reviewSchema subdocument Schema
  // Array includes multiple REVIEW data objects
  reviews: [reviewSchema]
});

// ==================================================
// COMPILE SCHEMA INTO A MODEL
// mongoose.model("Location", locationSchema, "locations")
// connectionName.model("modelName", schemaName, "MongoDBCollectionName")
// collection name is optional if new; lowercase and pluralized Model name by default
// if hooking into existing collection, INCLUDE EXISTING COLLECTION NAME
// ==================================================

// compile the defined Schema into a Mongoose Model
mongoose.model("Location", locationSchema);
