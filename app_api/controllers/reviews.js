// API controllers for reviews subdocs in locations collection,
// used by API routes/index.js as "ctrlReviews" variable

// defines API Controller functions used by API Routes,
// which access Mongoose API Models (who talk to the MongoDB)

// connect controller to Mongoose
const mongoose = require("mongoose");
// connect to the Mongoose model for "locations" collection
const Loc = mongoose.model("Location");

// post() /locations/:locationid/reviews
const reviewsCreate = (req, res) => {
  // placeholder response, until connected to db
  res.status(200).json({ status: "success" });
};

// GET /locations/:locationid/reviews/:reviewid
const reviewsReadOne = (req, res) => {
  // placeholder response, until connected to db
  res.status(200).json({ status: "success" });
};

// put() /locations/:locationid/reviews/:reviewid
const reviewsUpdateOne = (req, res) => {
  // placeholder response, until connected to db
  res.status(200).json({ status: "success" });
};

// delete() /locations/:locationid/reviews/:reviewid
const reviewsDeleteOne = (req, res) => {
  // placeholder response, until connected to db
  res.status(200).json({ status: "success" });
};

// export controller functions for use as methods
// of ctrlLocations in API routes/index.js
module.exports = {
  reviewsCreate,
  reviewsReadOne,
  reviewsUpdateOne,
  reviewsDeleteOne
};
