// controller for /location routes, imported by routes/index.js 
// route to view templates in app_server/views/.. for res.render is defined in app.js
// ========================================================

// controller for rendering the "/" home page index view (list of locations page)
const homelist = (req, res) => {
  // render views/locations-list.pug, use "Home" as the data for #{title}
  res.render("locations-list", { title: "Locations" });
};

// controller for rendering the "/location" page view
const locationInfo = (req, res) => {
  // render views/index.pug, use "Location info" as the data for #{title}
  res.render("location-info", { title: "Location info" });
};

// controller for rendering the "/location/review/new" page view
const addReview = (req, res) => {
  // render views/index.pug, use "Add review" as the data for #{title}
  res.render("location-review-form", { title: "Add review" });
};

module.exports = { 
  homelist,
  locationInfo,
  addReview
};
