// controller for /location routes, imported by routes/index.js 
// ========================================================

// controller for rendering the "/" home page index view (list of locations page)
const homelist = (req, res) => {
  // render views/index.pug, use "Home" as the data for #{title}
  // route to view templates in app_server/views/.. for res.render is defined in app.js
  res.render("index", { title: "Home" });
};

// controller for rendering the "/location" page view
const locationInfo = (req, res) => {
  // render views/index.pug, use "Home" as the data for #{title}
  // route to view templates in app_server/views/.. for res.render is defined in app.js
  res.render("index", { title: "Location info" });
};

// controller for rendering the "/location/review/new" page view
const addReview = (req, res) => {
  // render views/index.pug, use "Home" as the data for #{title}
  // route to view templates in app_server/views/.. for res.render is defined in app.js
  res.render("index", { title: "Add review" });
};

module.exports = { 
  homelist,
  locationInfo,
  addReview
};
