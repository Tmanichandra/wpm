// https://mean-loc8r-1.herokuapp.com/

const createError = require("http-errors");
const express = require("express");
const path = require("path");
const favicon = require("serve-favicon");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
// db.js does not export functions, so does NOT need a var name assigned
// connects Express/Node to Mongoose db models
require("./app_server/models/db");

// VIEWS router
const indexRouter = require("./app_server/routes/index");

// BOOK SAYS TO DELETE THIS ROUTE (IF SO, DELETE routes/users.js)
// const usersRouter = require("./app_server/routes/users");

// API router
const apiRoutes = require("./app_api/routes/index");

const app = express();

// view engine setup
app.set("views", path.join(__dirname, "app_server", "views"));
app.set("view engine", "pug");

// each server request passes through all app.use() middleware methods
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// after Express sends html to browser, html sends it's own request for static css, img, js
app.use(express.static(path.join(__dirname, "public"))); // path for static assets in /public

// listen for base URL request, handle with VIEWS router (app_server/routes/index.js)
app.use("/", indexRouter);

// BOOK SAYS TO DELETE THIS ROUTE (IF SO, DELETE routes/users.js)
// app.use("/users", usersRouter);

// listen for all API route calls, handle with API router (app_api/routes/index.js)
app.use("/api", apiRoutes)

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
