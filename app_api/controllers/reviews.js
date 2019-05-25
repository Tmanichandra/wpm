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
  Loc
    // find a document whose _id matches the request URL's :locationid data
    .findById(req.params.locationid)
    // but only ask for the name: and reviews: data to be returned (not all document data)
    .select("name reviews")
    // execute query, return data into 2nd param's "location" object
    .exec((err, location) => {
      // if a reviews: path exists and has at least 1 review object,
      if (location.reviews && location.reviews.length > 0) {
        // Mongoose .id() method, use :reviewid to find that review in location.reviews
        const review = location.reviews.id(req.params.reviewid);
        console.log(review);
        if (!review) {
          // if that review is not in location.reviews,
          return res.status(404).json({ message: "review not found" });
        } else {
          // otherwise create "response" object to return as JSON data (no let/const/var)
          response = {
            // from main "location" document, return location's (queried) name: and (given) _id:
            location: {
              name: location.name,
              id: req.params.locationid
            },
            // and return location's reviews: with just the one review queried
            review
          };
          return res.status(200).json(response);
        }
      } else {
        // but if reviews: path doesn't exist, or it exists but has 0 review objects
        return res.status(404).json({ message: "No reviews found" });
      }
    });
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
