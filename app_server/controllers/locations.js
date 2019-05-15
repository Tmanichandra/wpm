// controller for /location routes, imported by routes/index.js
// route to view templates in app_server/views/.. for res.render is defined in app.js
// ========================================================

// controller for rendering the "/" home page index view (list of locations page)
const homelist = (req, res) => {
  // 1st arg: name of the .pug file to render in /views
  res.render("locations-list", {
    // 2nd arg: JS object containing data to render in the 1st arg page view
    title: "Loc8r - find a place to work with wifi",
    pageHeader: {
      title: "Loc8r",
      strapline: "Find places to work with wifi near you!"
    },
    sidebar: "Looking for wifi and a seat? Loc8r helps you find places to work when out and about. Perhaps with coffee, cake, or a pint? Let Loc8r help you find the place you're looking for, mate.",
    locations: [
      {
        name: "Starcups",
        address: "125 High Street, Reading, RG6 1PS",
        rating: 3,
        facilities: ["Hot drinks", "Food", "Premium wifi"],
        distance: "100m"
      },
      {
        name: "Cafe Hero",
        address: "150 High Street, Reading, RG6 1PS",
        rating: 4,
        facilities: ["Hot drinks", "Premium wifi"],
        distance: "200m"
      },
      {
        name: "Burger Queen",
        address: "175 High Street, Reading, RG6 1PS",
        rating: 2,
        facilities: ["Food", "Premium wifi"],
        distance: "250m"
      }
    ]
  });
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
