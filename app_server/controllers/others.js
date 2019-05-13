// controller for other routes, imported by routes/index.js 
// route to view templates in app_server/views/.. for res.render is defined in app.js
// ========================================================

// controller for rendering the "/about" page view
const about = (req, res) => {
  // render views/generic-text.pug, use "About" as the data for #{title}
  res.render("generic-text", { title: "About" });
};

module.exports = { 
  about 
};
