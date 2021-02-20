const express = require("express");
const app = express();
var path = require("path");
require("dotenv").config();

const appRoute = require("./Routes");
app.use(express.static(__dirname + "/uploads"));
app.use(express.static(__dirname + "/public"));
// cors enable
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  next();
});

app.set("views", "./views");
app.set("view engine", "pug");

app.get("/", (req, res) => {
  console.log("app started", req.body);
  res.send(`App started dev...${req._parsedUrl._raw}${req.body}`);
});

app.use(
  express.urlencoded({
    extended: true,
  })
);

//Middelware for enabling read json body
app.use(express.json());

//Application routes
app.use("/api", appRoute);

//for unknown routes
app.use((req, res, next) => {
  const error = new Error("Page Not found");
  error.status = 404;
  next(error);
});

// Error Handler for express
app.use((error, req, res, next) => {
  console.log("I am called");
  res.status(error.status || 500);
  res.json({
    error: error.message,
  });
});

module.exports = app;
