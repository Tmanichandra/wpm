// controller for other routes, imported by routes/index.js 
// route to view templates in app_server/views/.. for res.render is defined in app.js
// ========================================================

// controller for rendering the "/about" page view
const about = (req, res) => {
  // render views/generic-text.pug, use "About" as the data for #{title}
  res.render("generic-text", { 
    title: "About Loc8r",
    content: "Loc8r was created to help people find places to sit down and get a bit of work done. And now a few words from our Swedish Chef.\n\nDedeeshka duu. Leebur deroor iehroom, Börk Börk Börk! Ut enim ad minim veniam, letsi ifder svensk og latin makinen dehr graek. Yöva gäta stahrt sömwaer. Vender gests kämmen vewänthärdis wehrdsen onderpasje.\n\nGotter refynne de typografisk, quis nostrud exercitation ullamco laboris, ifte kypter saelsfolk kviet. Yöva gäta stahrt sömwaer. Nawei raitinen de wehbsyte.\n\nNawei raitinen de wehbsyte. Nawei raitinen de wehbsyte. Vender gests kämmen vewänthärdis wehrdsen onderpasje." 
  });
};

module.exports = { 
  about 
};
