// index.js
// where your node app starts

// init project
var express = require('express');
var app = express();

// enable CORS (https://en.wikipedia.org/wiki/Cross-origin_resource_sharing)
// so that your API is remotely testable by FCC 
var cors = require('cors');
app.use(cors({optionsSuccessStatus: 200}));  // some legacy browsers choke on 204

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function (req, res) {
  res.sendFile(__dirname + '/views/index.html');
});


// your first API endpoint... 
app.get("/api/hello", function (req, res) {
  res.json({greeting: 'hello API'});
});

/**
 * 1. Debes proporcionar tu propio proyecto, no la URL de ejemplo.
 * Esperando:2. Una petición para /api/:date? con una fecha válida debe devolver un objeto JSON con una clave unix que es una marca de tiempo Unix de la fecha de entrada en milisegundos (como tipo Número)
 * Esperando:3. Una petición para /api/:date? con una fecha válida debe devolver un objeto JSON con una clave utc que es una cadena de la fecha de entrada en el formato: Thu, 01 Jan 1970 00:00:00 GMT
 * Esperando:4. Una petición a /api/1451001600000 debe devolver { unix: 1451001600000, utc: "Fri, 25 Dec 2015 00:00:00 GMT" }
 * Esperando:5. Tu proyecto puede manejar fechas que pueden ser analizadas con éxito por new Date(date_string)
 * Esperando:6. Si la cadena representando la fecha es inválida, la API devuelve un objeto con la estructura { error : "Invalid Date" }
 * Esperando:7. Un parámetro de fecha vacío debe devolver la hora actual en un objeto JSON con una clave unix
 * Esperando:8. Un parámetro de fecha vacío debe devolver la hora actual en un objeto JSON con una clave utc
 */

app.get("/api/:date?", (req, res) => {
  let date = req.params.date;
  let dateObject;

  // Si no se proporciona la fecha, devolver la fecha actual
  if (!date) {
    dateObject = new Date();
    return res.json({ unix: dateObject.getTime(), utc: dateObject.toUTCString() });
  }

  // Si el parámetro 'date' no es un número ni una fecha válida
  if (isNaN(date) && isNaN(Date.parse(date))) {
    return res.json({ error: "Invalid Date" });
  }

  // Si 'date' es un número, interpretarlo como un timestamp UNIX
  if (!isNaN(date)) {
    dateObject = new Date(parseInt(date));  // Convertir el número en un objeto Date
    return res.json({ unix: dateObject.getTime(), utc: dateObject.toUTCString() });
  }

  // Si 'date' es una cadena, intentar convertirla en un objeto Date
  dateObject = new Date(date);

  // Verificar si la fecha es válida
  if (dateObject.toString() === "Invalid Date") {
    return res.json({ error: "Invalid Date" });
  } else {
    return res.json({ unix: dateObject.getTime(), utc: dateObject.toUTCString() });
  }
});

// Listen on port set in environment variable or default to 3000
var listener = app.listen(process.env.PORT || 3000, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});
