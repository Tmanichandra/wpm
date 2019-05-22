// https://mean-loc8r-1.herokuapp.com/api/
// this file holds all API route definitions, referenced by main app.js file

// all routes handled here are already prefixed with /api
// so do not include /api in pathnames

// import the Express Router in order to add routes to it
const express = require("express");
const router = express.Router();

// import controller for the "locations" collection
const ctrlLocations = require("../controllers/locations");
// import controller for the "reviews" subdocuments
const ctrlReviews = require("../controllers/reviews");

// locations
router
  .route("/locations")
  .get(ctrlLocations.locationsListByDistance)
  .post(ctrlLocations.locationsCreate);

router
  .route("/locations/:locationid")
  .get(ctrlLocations.locationsReadOne)
  .put(ctrlLocations.locationsUpdateOne)
  .delete(ctrlLocations.locationsDeleteOne);

// reviews
router
  .route("/locations/:locationid/reviews")
  .post(ctrlReviews.reviewsCreate);

router
  .route("/locations/:locationid/reviews/:reviewid")
  .get(ctrlReviews.reviewsReadOne)
  .put(ctrlReviews.reviewsUpdateOne)
  .delete(ctrlReviews.reviewsDeleteOne);

module.exports = router;
