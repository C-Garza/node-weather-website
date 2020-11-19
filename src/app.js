const path = require("path");
const express = require("express");
const hbs = require("hbs");
const geoCode = require("./utils/geocode");
const foreCast = require("./utils/forecast");

const app = express();

//DEFINE PATHS FOR EXPRESS CONFIG
const publicDirectory = path.join(__dirname, "../public");
const viewsPath = path.join(__dirname, "../templates/views");
const partialsPath = path.join(__dirname, "../templates/partials");

//SETUP HANDLEBARS ENGINE AND VIEWS LOCATION
app.set("view engine", "hbs");
app.set("views", viewsPath);
hbs.registerPartials(partialsPath);

//SETUP STATIC DIRECTORY TO SERVE
app.use(express.static(publicDirectory));

app.get("", (req, res) => {
  res.render("index", {
    title: "Weather",
    name: "Chris G."
  });
});

app.get("/about", (req, res) => {
  res.render("about", {
    title: "About Me",
    name: "Chris G."
  });
});

app.get("/help", (req, res) => {
  res.render("help", {
    helpText: "Need some help?",
    title: "Help",
    name: "Chris G."
  });
});

app.get("/weather", (req,res) => {
  if(!req.query.address) {
    return res.send({
      error: "You must provide an address!"
    })
  }

  geoCode(req.query.address, (err, {latitude, longitude, location} = {}) => {
    if(err) {
      return res.send({
        error: err
      })
    }
    foreCast(latitude, longitude, (err, data) => {
      if(err) {
        return res.send({
          error: err
        })
      }
      return res.send({
        forecast: data,
        location,
        address: req.query.address
      })
    });
  });
});

app.get("/products", (req, res) => {
  if(!req.query.search) {
    return res.send({
      error: "You must provide a search term"
    })
  }

  console.log(req.query.search);
  res.send({
    products: []
  })
});

app.get("/help/*", (req, res) => {
  res.render("404", {
    title: "404",
    name: "Chris G.",
    errorMessage: "Help article not found."
  })
});

app.get("*", (req, res) => {
  res.render("404", {
    title: "404",
    name: "Chris G.",
    errorMessage: "Page not found."
  })
});

app.listen(3000, () => {
  console.log("Server is up on port 3000.");
});