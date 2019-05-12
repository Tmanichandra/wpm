// controller for routes/index.js
// ==============================

// controller to render views/index.pug template with specific data,
const index = (req, res) => {
  // render views/index.pug, use "Monkeypants" as the data for #{title}
  // route to app_server/views/.. for res.render is defined in app.js
  res.render("index", { title: "Monkeypants" });
};

module.exports = { index };
