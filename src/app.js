const path = require("path");
const express = require("express");
const hbs = require("hbs");
const geocode = require("./utils/geocode");
const forecast = require("./utils/forecast");

const app = express();

// Define paths for Express config
const publicDirectoryPath = path.join(__dirname, "../public");
const viewsPath = path.join(__dirname, "../templates/views");
const partialsPath = path.join(__dirname, "../templates/partials");

// set up handle bars engine
// npm i hbs@<version>
app.set("view engine", "hbs");

// point experss to a custom directory
app.set("views", viewsPath);

// nodemon src/app.js -e js,hbs
hbs.registerPartials(partialsPath);

// set up static directory to serve
app.use(express.static(publicDirectoryPath));

// app.com
app.get("/", (req, res) => {
  res.render("index", {
    title: "Weather",
    name: "Deku Cabrera",
  });
});

// app.com/about
app.get("/about", (req, res) => {
  res.render("about", {
    title: "About",
    name: "Deku Cabrera",
  });
});

// app.com/help
app.get("/help", (req, res) => {
  res.render("help", {
    helpText: "This is some helpful text.",
    title: "Help",
    name: "Deku Cabrera",
  });
});

// app.com/weather
app.get("/weather", (req, res) => {
  let address = req.query.address;

  if (!address) {
    return res.send({
      error: "You must provide an address",
    });
  }

  geocode(address, (error, { latitude, longitude, location } = {}) => {
    if (error) {
      return res.send({
        error,
      });
    }

    forecast(latitude, longitude, (error, forecastData) => {
      if (error) {
        return res.send({
          error,
        });
      }

      res.send({
        forecast: forecastData,
        location,
        address,
      });
    });
  });
});

app.get("/products", (req, res) => {
  if (!req.query.search) {
    return res.send({
      error: "You must provide a search term",
    });
  }

  res.send({
    products: [],
  });
});

app.get("/help/*", (req, res) => {
  res.render("error", {
    title: "404",
    errorMsg: "Help article not found",
    name: "Deku Cabrera",
  });
});

// error page
app.get("*", (req, res) => {
  res.render("error", {
    title: "404",
    errorMsg: "My 404 page",
    name: "Deku Cabrera",
  });
});

// Starts up the server and has it listen to a specific port
app.listen(3000, () => {
  console.log("Server is up on port 3000.");
});
