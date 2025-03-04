let express = require('express');
const bodyParser = require("body-parser");
let app = express();

console.log("Hello World");
app.use(bodyParser.urlencoded({ extended: false }));

app.use(function(req, res, next) {
  console.log(req.method + " " + req.path + " - " + req.ip);
  next();
});


/* app.get("/", function(req, res) {
  res.send("Hello Express");
})
 */

app.get("/", function(req, res) {
  res.sendFile(__dirname + "/views/index.html");
})

app.use("/public", express.static(__dirname + "/public"));
app.get("/json", function(req, res) {
  if (process.env.MESSAGE_STYLE === "uppercase") {
    res.json({"message": "HELLO JSON"});
  } else {
    res.json({"message": "Hello json"});
  }
});

app.get("/now", function(req, res, next) {
  req.time = new Date().toString();
  next();
}, function(req, res) {
  res.send({"time": req.time});
});

//GET /:word/echo
app.get("/:word/echo", function(req, res) {
  res.json({"echo": req.params.word});
});

app.get("/name", function(req, res) {
  //first=firstname&last=lastname
  const { first: firstName, last: lastName } = req.query;
  return res.json({ name: `${firstName} ${lastName}` });
});


app.post("/name", function(req, res) {
  //first=firstname&last=lastname
  const { first: firstName, last: lastName } = req.body;
  return res.json({ name: `${firstName} ${lastName}` });
});

















 module.exports = app;
