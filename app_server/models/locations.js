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
// BASIC LOCATION INFO: PRIMARY/PARENT DOCUMENT SCHEMA
// ==================================================

// create and define the Schema for locations.js
// refer to FPO data in the controller, moved back from views during dev process
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
    // shouldn't this be "type: Array"? Don't understand this syntax
    type: { type: String },
    // coordinates are an array of Numbers (long: -180 to 180, lat: -90 to 90)
    coordinates: [Number]
  },
  // Array includes data from openingTimesSchema subdocument Schema, above
  // Array can include multiple objects for days/day groups of opening/closing times
  openingTimes: [openingTimeSchema],
  // Array includes multiple REVIEW data objects, includes reviewSchema subdoc schema
  reviews: [reviewSchema]
});

// make the coords: path an INDEX in locationSchema to speed up coordinate-based queries
// "2dsphere" allows long/lat calculations on coordinate queries
locationSchema.index({ coords: "2dsphere" });

// ==================================================
// COMPILE SCHEMA INTO A MODEL
// mongoose.model("Location", locationSchema, "locations")
// connectionName.model("modelName", schemaName, "MongoDBCollectionName")
// collection name is optional if new; lowercase and pluralized Model name by default
// if hooking into existing collection, INCLUDE EXISTING COLLECTION NAME
// ==================================================

// MongoDB will name the collection "locations" ("Location" as plural and lowercase)
mongoose.model("Location", locationSchema);

// ==================================================
// for this application, you can find your own personal lat/long with:
// https://whatsmylatlng.com/
// RVA:
// (37.6192, -77.4960) lat/long, so flip to long/lat:
// -77.4960, 37.6192
// ==================================================

// ==================================================
// MapQuest tool for finding any place's lat/long
// https://developer.mapquest.com/documentation/tools/latitude-longitude-finder/
// ==================================================

// ==================================================
// Proper Pie - 2505 E Broad St #100, Richmond VA 23223
// Sun : 10:00am - 6:00pm
// Mon, Tue : Closed
// Wed, Thu, Fri, Sat : 10:00am - 7:00pm
// New Zealand Pies, Pastries, Wifi
// Longitude: -77.418548, Latitude: 37.531502
// -77.418548, 37.531502
// ==================================================

// ==================================================
// Bottoms Up Pizza - 1700 Dock St, Richmond, VA 23223
// Sun, Thu : 11:00am - 11:00pm
// Mon, Tue, Wed : 11:00am - 10:00pm
// Fri, Sat : 11:00am - 12:00am
// Amazeballs Pizza, Beer, Wifi
// Longitude: -77.42954, Latitude: 37.532191
// -77.42954, 37.532191
// ==================================================

// ==================================================
// Pizza & Beer of Richmond - 2553 W Cary St, Richmond, VA 23220
// Mon, Tue, Wed : 11:00am - 11:00pm
// Thu, Fri, Sat : 11:00am - 12:00am
// Gourmet Pizza, PBR, Wifi
// Longitude: -77.473308, Latitude: 37.550535
// -77.473308, 37.550535
// ==================================================

/* seed document

db.locations.save({
  name: 'Proper Pie',
  address: '2505 E Broad St #100, Richmond VA 23223',
  rating: 5,
  facilities: ['New Zealand Pies', 'Pastries', 'Wifi'],
  coords: [-77.418548, 37.531502],
  openingTimes: [{
    days: 'Sun',
    opening: '10:00am',
    closing: '6:00pm',
    closed: false
  },{
    days: 'Mon, Tue',
    closed: true
  },{
    days: 'Wed, Thu, Fri, Sat',
    opening: '10:00am',
    closing: '7:00pm',
    closed: false
  }]
})

*/
