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
const renderDetailPage = (req, res, location) => {
  // check location data being passed in
  console.log(location);

  // render views/index.pug, use "Location info" as the data for #{title}
  res.render("location-info", {
    title: location.name,
    pageHeader: {
      title: location.name
    },
    sidebar: {
      context: "is on Loc8r because it has accessible wifi and space to sit down with your laptop and get some work done.",
      callToAction: "If you've been and you like it - or if you don't - please leave a review to help other people just like you."
    },
    location // and just include the whole location object with all it's data for PUG
  });
};

// --------------

// error handler helper function for messages when statusCode is NOT 200
const showError = (req, res, status) => {
  let title = "";
  let content = "";
  if (status === 404) {
    title = "404, Page Not Found";
    content = "Oopsie. Can't find this page, sorry.";
  } else {
    title = `${status}, something's gone awry.`;
    content = "Something, somewhere, has gone just a little bit wrongish.";
  }
  res.status(status);
  // use the generic-text.pug template to render error message pages
  res.render("generic-text", {
    title,
    content
  });
};

// --------------

// reusable helper function which uses any callback passed to it
const getLocationInfo = (req, res, callback) => {
  // construct API URL path with /:locationid of URL call to view controller
  const path = `/api/locations/${req.params.locationid}`;
  // construct request object to send to API URL
  const requestOptions = {
    // attach above path to end of dev or production server base URL
    url: `${apiOptions.server}${path}`,
    method: "GET",
    json: {}
  };
  // and then make the API call by sending the request object to Request
  // destructure statusCode variable from response param (don't need other response data)
  request(requestOptions, (err, { statusCode }, body) => {
    // reformat the coords: data from an array to a lng/lat object
    let data = body;
    // as long as status is 200, run render code
    if (statusCode === 200) {
      data.coords = {
        lng: body.coords[0],
        lat: body.coords[1]
      };
      // and run whatever callback function was passed into getLocationInfo
      callback(req, res, data);
    } else {
      // but if statusCode is NOT 200, pass the statusCode to showError() handler
      showError(req, res, statusCode);
    }
  });
};

// --------------

// controller for rendering the "/location" page view
const locationInfo = (req, res) => {
  // use generic getLocationInfo and pass it a callback which calls renderDetailPage
  getLocationInfo(req, res, (req, res, responseData) => renderDetailPage(req, res, responseData));
};

// ========================================================

// separate function for actually rendering the Add New Review page, called by addReview
// destructure .name property from all responseData passed in
const renderReviewForm = (req, res, { name }) => {
  // render location-review-form.pug, pass in destructured .name from responseData
  res.render("location-review-form", {
    title: `Review ${name} on Loc8r`,
    pageHeader: { title: `Review ${name}` },
    // if page is re-rendered with an error, pass that to the page view render engine
    error: req.query.err
  });
};

// controller GET route on "/location/review/new" to create New Review page view
const addReview = (req, res) => {
  // use generic getLocationInfo and pass it a callback which calls renderReviewForm
  getLocationInfo(req, res, (req, res, responseData) => renderReviewForm(req, res, responseData));
};

// ========================================================

// controller called when a user posts new review to location-review-form.pug view
// example: http://localhost:3000/location/5cea24ba492efd0e825284c3/review/new
const doAddReview = (req, res) => {
  // get the value at /:locationid/ defined in the page view route
  const locationid = req.params.locationid;
  // console.log(req.params);
  // use that :locationid to construct an api call route
  const path = `/api/locations/${locationid}/reviews`;
  // get data from req.body as POSTed by the form to the page view route
  // console.log(req.body);
  const postdata = {
    author: req.body.name,
    rating: parseInt(req.body.rating, 10),
    reviewText: req.body.review
  };
  // console.log(postdata);
  // build request data: API URL, method, and postdata object
  const requestOptions = {
    url: `${apiOptions.server}${path}`,
    method: "POST",
    json: postdata
  };
  // console.log(requestOptions);
  // make the actual request with (requestOptions, callback to handle data returned)
  // deconstruct statusCode from RESPONSE, and name from BODY
  request(requestOptions, (err, { statusCode }, { name }) => {
    if (statusCode === 201) {
      // if successful, go back to the location's main page view
      res.redirect(`/location/${locationid}`);
      // but, if the post attempt results in a simple ValidationError,
    } else if (statusCode === 400 && name && name === "ValidationError") {
      // send user back to the Create New Review page, WITH the error value in URL,
      // so we can alert the user to the problem using ?err=val onto the GET route
      // that calls addReview, which uses renderReviewForm to create the page view
      res.redirect(`/location/${locationid}/review/new?err=val`);
    } else {
      // but if something else has gone wrong, console it display HTTP error code on page
      console.log(body);
      showError(req, res, statusCode);
    }
  });
};

// ========================================================

module.exports = {
  homelist,
  locationInfo,
  addReview,
  doAddReview
};

// ========================================================
