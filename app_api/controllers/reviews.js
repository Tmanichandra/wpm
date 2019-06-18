// API controllers for reviews subdocs in locations collection,
// used by API routes/index.js as "ctrlReviews" variable

// defines API Controller functions used by API Routes,
// which access Mongoose API Models (who talk to the MongoDB)

// connect controller to Mongoose
const mongoose = require("mongoose");
// connect to the Mongoose model for "locations" collection
const Loc = mongoose.model("Location");

// ==============================================================================
// updateAverageRating() helper function, and it's helper doSetAverageRating()
// broken out for use by both reviewsCreate AND reviewsUpdateOne controllers
// ==============================================================================

// helper's helper's helper function for createReview
// used by updateAverageRating
// location is passed in, containing only needed "rating" and "reviews" data for efficiency
const doSetAverageRating = location => {
  // if a "reviews" path exists in document, AND it has at least 1 object in it,
  if (location.reviews && location.reviews.length > 0) {
    // then set a var for the length of the "reviews" array, and
    const count = location.reviews.length;
    // use .reduce() on all (deconstructed) location.reviews.rating values
    // arr.reduce(callback(accumulator, currentValue[, index[, array]]), [, initialValue])
    const total = location.reviews.reduce((acc, { rating }) => {
      // take accumulated value (acc) and add the next location.reviews.rating value to it,
      // over and over for all location.reviews.rating values,
      // and return a single sum number as the value of "total"
      return acc + rating;
      // and start the accumulation value from 0 (the usual case)
    }, 0);
    // use parseInt() to divide the sum of all reviews by the number of reviews (in base 10)
    // to set a new value for the current "location" document's "rating" path value
    location.rating = parseInt(total / count, 10);
    // and then (Mongoose/MongoDB) .save() the "location" document (with new "rating" value set)
    location.save(err => {
      if (err) {
        console.log(err);
      } else {
        // Node console a message with the new location.rating value
        console.log(`Average rating updated to ${location.rating}`);
      }
    });
  }
};

// ---------------------------------------

// helper function to doAddReview, which is a helper to reviewsCreate
// updates the location's average review based on newly added review rating number
const updateAverageRating = locationId => {
  // _id of current "location" document is passed in,
  Loc
    // have Mongoose find the current "location" document by it's _id
    .findById(locationId)
    // for speed, only ask for that document's "rating" and "reviews" path data
    .select("rating reviews")
    // now with only "rating" and "reviews" data for the "location",
    .exec((err, location) => {
      // if no error occurs
      if (!err) {
        // execute helper's helper's helper and pass "location" data (only rating and reviews)
        doSetAverageRating(location);
      }
    });
};

// ==============================================================================
// createReview controller and it's helper function
// ==============================================================================

// adds a new "review" subdocument to a "locations" document and saves that doc
// used by reviewsCreate controller
const doAddReview = (req, res, location) => {
  // if that "location" document doesn't exist,
  if (!location) {
    res.status(404).json({ message: "Location not found" });
  } else {
    // destructure creation of 3 vars at once, from SAME req.body.propertynames,
    // so, author = req.body.author, etc.
    const { author, rating, reviewText } = req.body;
    // .push() a new "review" object onto the end of the "reviews" path array
    // of the selected location, with the POST data from the 3 req.body vars above
    location.reviews.push({
      author,
      rating,
      reviewText
    });
    // then .save() that location with its updated "reviews" array
    // and execute the following callback code after the document is saved
    location.save((err, location) => {
      if (err) {
        console.log(err);
        res.status(400).json(err);
      } else {
        // call the helper's helper function to update the location's average rating
        // by passing it the _id of the current "location" document
        updateAverageRating(location._id);
        // get just the last review object (the review just added),
        const thisReview = location.reviews.slice(-1).pop();
        // and return just that new review as the query's result JSON (with 201)
        res.status(201).json(thisReview);
      }
    });
  }
};

// ---------------------------------------

// post() /locations/:locationid/reviews
const reviewsCreate = (req, res) => {
  // _id of document to create a review in
  const locationId = req.params.locationid;
  // if a document with that _id exists,
  if (locationId) {
    Loc
      // target that document,
      .findById(locationId)
      // and select that doc's "reviews" path data (an array of objects)
      .select("reviews")
      // and execute the following code:
      .exec((err, location) => {
        // if an error occurs, send 400 status and error message
        if (err) {
          res.status(400).json(err);
        } else {
          // otherwise execute the doAddReview function (see func expression above)
          doAddReview(req, res, location);
        }
      });
  } else {
    // but if a document with that _id DOES NOT exist, send this back:
    res.status(404).json({ message: "Location not found" });
  }
};

// ==============================================================================
// reviewsReadOne controller
// ==============================================================================

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
        // console.log(review);
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

// ==============================================================================
// reviewsUpdateOne controller
// ==============================================================================

// PUT /locations/:locationid/reviews/:reviewid
const reviewsUpdateOne = (req, res) => {
  // if EITHER the locationid OR reviewid are not sent,
  if (!req.params.locationid || !req.params.reviewid) {
    // return an error message
    return res.status(404).json({ message: "Not found, locationid and reviewid both required" });
  }
  // but if both locationid and reviewid recieved, then find the document,
  Loc.findById(req.params.locationid)
    // and select the "reviews" path/field that holds the subdocuments
    .select("reviews")
    // and start doing stuff
    .exec((err, location) => {
      // check for existence of that location, and handle any errors
      if (!location) {
        return res.status(404).json({ message: "Location not found" });
      } else if (err) {
        return res.status(400).json(err);
      }
      // if location exists and no errors occurred,
      // and if "reviews" path/field exists AND it has one or more review objects in it,
      if (location.reviews && location.reviews.length > 0) {
        // use Mongoose .id() method to select a review with the requested reviewid
        const thisReview = location.reviews.id(req.params.reviewid);
        // but if a review with that reviewid does not exist
        if (!thisReview) {
          // send a "not found" message
          res.status(404).json({ message: "Review not found" });
        } else {
          // otherwise, if everything is good, set your change data on thisReview variable
          thisReview.author = req.body.author;
          thisReview.rating = req.body.rating;
          thisReview.reviewText = req.body.reviewText;
          // then run .save(), whose callback will also run updateAverageRating() helper
          location.save((err, location) => {
            if (err) {
              res.status(404).json(err);
            } else {
              // run updateAverageRating() and pass it the main document's _id
              updateAverageRating(location._id);
              // and return the thisReview object data as the operation result
              res.status(200).json(thisReview);
            }
          });
        }
      } else {
        // but if either "reviews" doesn't exist, or if it exists but contains 0 review objects
        res.status(404).json({ message: "No review to update" });
      }
    });
};

// ==============================================================================
// reviewsDeleteOne controller
// ==============================================================================

// delete() /locations/:locationid/reviews/:reviewid
const reviewsDeleteOne = (req, res) => {
  // set two vars by destructuring req.params.locationid and req.params.reviewid
  const { locationid, reviewid } = req.params;
  // if EITHER locationid or reviewid are not provided by the API URL,
  if (!locationid || !reviewid) {
    // return error status and message
    return res.status(404).json({ message: "locationid and reviewid BOTH requiered" });
  }
  // otherwise have Mongoose find the parent document,
  Loc.findById(locationid)
    // and select only the "reviews" data path holding the subdocuments
    .select("reviews")
    // and then execute that find and select, with callback doing the rest
    .exec((err, location) => {
      // if no location found with that _id,
      if (!location) {
        return res.status(404).json({ message: "Location not found" });
      } else if (err) {
        // or if an error occured, return the error message generated
        return res.status(400).json(err);
      }
      // if error tests pass, and
      // if "reviews" path exists and it contains at least one review
      if (location.reviews && location.reviews.length > 0) {
        // if the reviewid of a review isn't found in "reviews" of that document
        if (!location.reviews.id(reviewid)) {
          // return an error that the review wasn't found
          return res.status(404).json({ message: "Review not found" });
        } else {
          // otherwise if the review was found, remove it
          location.reviews.id(reviewid).remove();
          // and then SAVE THE MAIN LOCATION DOCUMENT
          location.save(err => {
            // if an error was passed into .save()'s (err) parameter,
            if (err) {
              // return the error message
              return res.status(404).json(err);
            } else {
              // but if the save completed normally, run the average rating updater
              // to recalculate the location document's average rating value
              updateAverageRating(location._id);
              // and return a success status with "null" data returned
              res.status(204).json(null);
            }
          });
        }
      } else {
        // but if either "reviews" path doesn't exist, OR it holds 0 reviews,
        res.status(404).json({ message: "No Review to delete" });
      }
    });
};

// ==============================================================================
// EXPORT reviews controllers
// ==============================================================================

// export controller functions for use as methods
// of ctrlLocations in API routes/index.js
module.exports = {
  reviewsCreate,
  reviewsReadOne,
  reviewsUpdateOne,
  reviewsDeleteOne
};
