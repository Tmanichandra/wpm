// controller for other routes, imported by routes/index.js 
// ========================================================

// controller for rendering the "/about" page view
const about = (req, res) => {
  // render views/index.pug, use "About" as the data for #{title}
  // route to view templates in app_server/views/.. for res.render is defined in app.js
  res.render("index", { title: "About" });
};

module.exports = { 
  about 
};
