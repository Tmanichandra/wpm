// this file creates Mongoose interface and is required by Express (app.js)
// MongoDB <> Mongoose <> Express/Node <> app <> views

// ==================================================
// REQUIRE Mongoose AND CONNECT TO MongoDB
// ==================================================

// this file is the Mongoose interface
const mongoose = require("mongoose");

// mongodb://username:password@localhost:portnumber/databasename
// MongoDB URI: username, password, and portnumber are all optional
let dbURI = "mongodb://localhost/Loc8r";

// conditional detects whether NODE_ENV is Heroku ("production"),
// because if not, NODE_ENV is either "undefined", "dev", "test", etc.
if (process.env.NODE_ENV === "production") {
  // use MONGODB_URI environment variable to protect personal UN, PW, etc.
  dbURI = process.env.MONGODB_URI;
}

// create the connection to MongoDB from this file (Mongoose)
mongoose.connect(dbURI, { useNewUrlParser: true });

// ==================================================
// CONNECT TO A SECOND DATABASE TO HOLD EVENT LOGS
// ==================================================

// URI to separate log database for Loc8r app
const dbURIlog = "mongodb://localhost/Loc8rLog";

// use createConnection() instead of .connect to create a named connection
const logDB = mongoose.createConnection(dbURIlog, { useNewUrlParser: true });

// connect to the Loc8rLog db
logDB.on("connected", () => {
  console.log(`Mongoose connected to ${dbURIlog}`);
});

// disconnect from the Loc8rLog db
logDB.close(() => {
  console.log("Mongoose log disconnected");
});

// ==================================================
// console.log CONNECT, ERROR, and DISCONNECT events
// ==================================================

// log to console Mongoose connections, errors, and disconnects
mongoose.connection.on("connected", () => {
  console.log(`Mongoose connected to ${dbURI}`);
});
mongoose.connection.on("error", err => {
  console.log("Mongoose connection error: ", err);
});
mongoose.connection.on("disconnected", () => {
  console.log("Mongoose disconnected");
});

// ==================================================
// GRACEFULLY CLOSE MongoDB CONNECTION ON SHUTDOWN/RESTART
// ==================================================

// function used to gracefully close Mongoose's connection to MongoDB
const gracefulShutdown = (msg, callback) => {
  mongoose.connection.close(() => {
    console.log(`Mongoose disconnected through ${msg}`);
    callback();
  });
};

// add event listeners which use gracefulShutdown() function above
// listen for a nodemon restart, close db connection
// use .once instead of .on, because nodemon listens for same event,
// using .on would prevent nodemon from working
process.once("SIGUSR2", () => {
  gracefulShutdown("nodemon restart", () => {
    process.kill(process.pid, "SIGUSR2");
  });
});
// listen for app termination, close db connection
process.on("SIGINT", () => {
  gracefulShutdown("app termination", () => {
    process.exit(0);
  });
});
// listen for Heroku's spin-down termination event, close db connection
process.on("SIGTERM", () => {
  gracefulShutdown("Heroku app shutdown", () => {
    process.exit(0);
  });
});

// ==================================================
// IMPORT MONGOOSE SCHEMA DEFINITION FILES
// ==================================================

// require the locations.js Mongoose Schema definition file
require("./locations");
