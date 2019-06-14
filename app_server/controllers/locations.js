// controller for /location routes, imported by routes/index.js
// route to view templates in app_server/views/.. for res.render is defined in app.js
// ========================================================

// this is the only file that will be making API calls, so this is the only file
// that needs to use the npm "request" module to use it to make API calls
// JS HTTP request libraries: Axios, Request, Superagent, Fetch, Supertest
const request = require("request");

// configure API routes based on server production or dev environments
// set localhost dev server as default URL base for API calls,
const apiOptions = {
  server: "http://localhost:3000"
};
// but add conditional to check NODE_ENV for production environment
if (process.env.NODE_ENV === "production") {
  // if production environment, use production server URL base
  apiOptions.server = "https://mean-loc8r-1.herokuapp.com";
}

// ========================================================

// distance formatting helper function for meters and kilometers
const formatDistance = distance => {
  let thisDistance = 0;
  let unit = "m";
  if (distance > 1000) {
    // if more than 1000 meters, convert to km with 1 decimal place
    thisDistance = parseFloat(distance / 1000).toFixed(1);
    unit = "km";
  } else {
    // otherwise if less than 1000 meters, round to whole integer (no decimals)
    thisDistance = Math.floor(distance);
  }
  return thisDistance + unit;
};

// --------------

// separate render function for the "homelist" controller to use
const renderHomepage = (req, res, responseBody) => {
  // handle possible: data array, empty array, or error message responseBody
  let message = null; // message is null by default
  // if responseBody is NOT an Array,
  if (!(responseBody instanceof Array)) {
    message = "API lookup error"; // set an error message
    responseBody = []; // convert responseBody to empty array to prevent view error
  } else {
    // or if responseBody is empty (array with length of 0)
    if (!responseBody.length) {
      message = "No places found nearby"; // set a no places found message
    }
  }
  // but if responseBody is a filled array, then continue (with message as null)
  // 1st arg: name of the .pug file to render in /views
  res.render("locations-list", {
    // 2nd arg: JS object containing data to render in the 1st arg page view
    title: "Loc8r - find a place to work with wifi",
    pageHeader: {
      title: "Loc8r",
      strapline: "Find places to work with wifi near you!"
    },
    sidebar:
      "Looking for wifi and a seat? Loc8r helps you find places to work when out and about. Perhaps with coffee, cake, or a pint? Let Loc8r help you find the place you're looking for, mate.",
    // return the responseBody locations array, and message value, as locations: data
    locations: responseBody,
    message
  });
};

// --------------

// controller for rendering the "/" home page index view (list of locations page)
const homelist = (req, res) => {
  // define api/path which extends the base URL
  const path = "/api/locations";

  // define the request object
  const requestOptions = {
    // template literal adds "path" onto the base URL
    url: `${apiOptions.server}${path}`,
    method: "GET",
    json: {},
    // query string parameter data to send with request
    qs: {
      lng: -0.969,
      lat: 51.455,
      maxDistance: 20
      // lng: 0,
      // lat: 0,
      // maxDistance: 0
      // lng: 1, // test "no places found nearby"
      // lat: 1, // test "no places found nearby"
      // maxDistance: 0.002 // test "no places found nearby"
    }
  };

  // then make the actual "request" function call, with request object and callback
  // destructure a statusCode var from statusCode in "response" param position
  request(requestOptions, (err, { statusCode }, body) => {
    // .map() body data to use formatDistance() on distance values
    let data = [];
    // if successful data return,
    if (statusCode === 200 && body.length) {
      // fill "data" array with data "item"s having formatted .distance values
      data = body.map(item => {
        item.distance = formatDistance(item.distance);
        console.log(item);
        return item;
      });
    }
    // use external function to handle rendering "data" array to page view
    renderHomepage(req, res, data);
  });
};

// ========================================================
// ========================================================

// separate function to handle page rendering of data on a location's details page
const renderDetailPage = (req, res) => {
  // render views/index.pug, use "Location info" as the data for #{title}
  res.render("location-info", {
    title: "Starcups",
    pageHeader: {
      title: "Loc8r"
    },
    sidebar: {
      context: "is on Loc8r because it has accessible wifi and space to sit down with your laptop and get some work done.",
      callToAction: "If you've been and you like it - or if you don't - please leave a review to help other people just like you."
    },
    location: {
      name: "Starcups",
      address: "125 High Street, Reading, RG6 1PS",
      rating: 3,
      facilities: ["Hot drinks", "Food", "Premium wifi"],
      coords: { lat: 51.455041, lng: -0.9690884 },
      openingTimes: [
        {
          days: "Monday - Friday",
          opening: "7:00am",
          closing: "7:00pm",
          closed: false
        },
        {
          days: "Saturday",
          opening: "8:00am",
          closing: "5:00pm",
          closed: false
        },
        {
          days: "Sunday",
          closed: true
        }
      ],
      reviews: [
        {
          author: "Simon Holmes",
          rating: 5,
          timestamp: "16 July 2013",
          reviewText: "What a great place. I can't say enough good things about it."
        },
        {
          author: "Charlie Chaplin",
          rating: 3,
          timestamp: "16 June 2013",
          reviewText: "It was okay. Coffee wasn't great, but the wifi was fast."
        }
      ]
    }
  });
};

// controller for rendering the "/location" page view
const locationInfo = (req, res) => {
  // 
  const path = `/api/locations/${req.params.locationid}`;
  // 
  const requestOptions = {
    url: `${apiOptions.server}${path}`,

  }
  renderDetailPage(req, res);
};

// ========================================================

// controller for rendering the "/location/review/new" page view
const addReview = (req, res) => {
  // render views/index.pug, use "Add review" as the data for #{title}
  res.render("location-review-form", {
    title: "Review Starcups on Loc8r",
    pageHeader: { title: "Review Starcups" }
  });
};

// ========================================================

module.exports = {
  homelist,
  locationInfo,
  addReview
};

// ========================================================
