// index.js
// where your node app starts

// init project
require("dotenv").config();
var express = require("express");
var app = express();

// enable CORS (https://en.wikipedia.org/wiki/Cross-origin_resource_sharing)
// so that your API is remotely testable by FCC
var cors = require("cors");
app.use(cors({ optionsSuccessStatus: 200 })); // some legacy browsers choke on 204

// http://expressjs.com/en/starter/static-files.html
app.use(express.static("public"));

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function (req, res) {
  res.sendFile(__dirname + "/views/index.html");
});

// your first API endpoint...
app.get("/api/hello", function (req, res) {
  res.json({ greeting: "hello API" });
});

/**
 * 1. Debes proporcionar tu propio proyecto, no la URL ejemplo.
 * Esperando:2. Una petición a /api/whoami debe devolver un objeto JSON con tu dirección IP en la clave ipaddress.
 * Esperando:3. Una petición a /api/whoami debe devolver un objeto JSON con tu idioma preferido en la clave language.
 * Esperando:4. Una petición a /api/whoami debe devolver un objeto JSON con tu software en la clave de software.
 */

//example
//{"ipaddress":"::ffff:159.20.14.100","language":"en-US,en;q=0.5", "software":"Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:50.0) Gecko/20100101 Firefox/50.0"}
app.get("/api/whoami", function (req, res) {
  return res.json({
    ipaddress: req.ip,
    language: req.headers["accept-language"],
    software: req.headers["user-agent"],
  });
});


// listen for requests :)
var listener = app.listen(process.env.PORT || 3000, function () {
  console.log("Your app is listening on port " + listener.address().port);
});
