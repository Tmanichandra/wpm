// home page "/" route called by app.js
// ====================================

const express = require("express");
const router = express.Router();

// require app_server/controllers/main.js (exports "index" function)
const ctrlMain = require("../controllers/main");

// GET home page using "index" from app_server/controllers/main.js
router.get("/", ctrlMain.index);

// router.get(..) added to express.Router() and exported
// so that route is available when this file is required and called
module.exports = router;
