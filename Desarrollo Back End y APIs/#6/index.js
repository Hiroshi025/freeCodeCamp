require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const app = express();

// Basic Configuration
mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const port = process.env.PORT || 3000;

const urlShort = new mongoose.Schema({
  original_url: String,
  short_url: {
    type: String,
  },
});

const UrlShort = mongoose.model("UrlShort", urlShort);

const generateShortUrl = async () => {
  //generara un string con numeros y letras (mayusculas y minusculas) de 6 caracteres
  const characters =
    "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
  let shortUrl = "";

  for (let i = 0; i < 6; i++) {
    shortUrl += characters.charAt(
      Math.floor(Math.random() * characters.length)
    );
  }

  return shortUrl;
};

app.use(cors());

app.use("/public", express.static(`${process.cwd()}/public`));

app.get("/", function (req, res) {
  res.sendFile(process.cwd() + "/views/index.html");
});

// Your first API endpoint
app.get("/api/hello", function (req, res) {
  res.json({ greeting: "hello API" });
});

/**
 * Esperando:1. Debes proporcionar tu propio proyecto, no la URL de ejemplo.
 * Esperando:2. Puedes POST una URL a /api/shorturl y obtener una respuesta JSON con propiedades original_url y short_url. Aquí hay un ejemplo: { original_url : 'https://freeCodeCamp.org', short_url : 1}
 * Esperando:3. Cuando visitas /api/shorturl/<short_url>, serás redirigido a la URL original.
 * Esperando:4. Si pasas una URL inválida que no sigue el formato válido http://www.example.com, la respuesta JSON contendrá { error: 'invalid url' }
 */

app.post("/api/shorturl", function (req, res) {
  const { url } = req.body;
  const originalUrl = url;
  //shorturl sera una clave unica que servira apara poder identificar la url que se acaba de guardar
  let shortUrl;

  const formatUrl = /^https?:\/\/www\.\w+\.\w+/;
  if (!formatUrl.test(originalUrl)) {
    return res.json({ error: "invalid url" });
  }

  UrlShort.create({ original_url: originalUrl }, async function (err, data) {
    if (err) {
      console.log(err);
    } else {
      shortUrl = await generateShortUrl();
      data.short_url = shortUrl;
      data.save();
      res.json({ original_url: originalUrl, short_url: shortUrl });
    }
  });
});

app.get("/api/shorturl/:short_url", function (req, res) {
  const { short_url } = req.params;

  UrlShort.findOne({ short_url: short_url }, function (err, data) {
    if (err) {
      console.log(err);
    } else {
      if (data) {
        res.redirect(data.original_url);
      }
    }
  });
});

app.listen(port, function () {
  console.log(`Listening on port ${port}`);
});
