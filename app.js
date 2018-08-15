const express = require("express");
const bodyParser = require("body-parser");
const logger = require("morgan");
const mongoose = require("mongoose");
const env = require("./config/environment");

var app = express();

mongoose.connect("mongodb://localhost:27017/" + env.mongodb.database);

const db = mongoose.connection;
db.on("error", function() {
  console.log("Connection Failed!");
});
db.once("open", function() {
  console.log("Connected!");
});

// Middlewares
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(logger("dev"));
app.use(express.static(__dirname + "/public"));
app.use(function(req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-Requested-With,content-type, Authorization"
  );
  next();
});

// Routes
app.get("/", (req, res, next) => {
  res.status(200).json({
    message: "You requested index page"
  });
});

app.use("/users", require("./app/routes/users.js"));
app.use("/auth", require("./app/routes/auth.js"));

// Catch 404 Errors and forward them to error handler
app.use((req, res, next) => {
  const err = new Error("Not Found");
  err.status = 404;
  next(err);
});

// Error handler function
app.use((err, req, res, next) => {
  const error = app.get("env") === "development" ? err : {};
  const status = err.status || 500;
  // Respond to client
  res.status(status).json({
    error: {
      message: error.message
    }
  });

  // Respond to ourselves
  console.error(err);
});

//Start the Server
const port = env.port || 8888;

app.listen(port, () => console.log(`Server is listening on port ${port}`));

module.exports = app;
