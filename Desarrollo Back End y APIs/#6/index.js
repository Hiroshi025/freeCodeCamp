require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const dns = require("dns");
const url = require("url");

const app = express();

// Conexión a MongoDB
mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const port = process.env.PORT || 3000;

const urlShortSchema = new mongoose.Schema({
  original_url: String,
  short_url: Number,
});

const UrlShort = mongoose.model("UrlShort", urlShortSchema);

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());
app.use("/public", express.static(`${process.cwd()}/public`));

app.get("/", (req, res) => {
  res.sendFile(process.cwd() + "/views/index.html");
});

// **POST /api/shorturl** - Acorta una URL
app.post("/api/shorturl", async (req, res) => {
  const url_input = req.body.url;
  const parsedUrl = url.parse(url_input);

  // Validar que la URL tenga un protocolo válido y un hostname
  if (!parsedUrl.protocol || !parsedUrl.hostname) {
    return res.json({ error: "invalid url" });
  }

  // Verificar si el dominio es válido con DNS lookup
  dns.lookup(parsedUrl.hostname, async (err) => {
    if (err) {
      return res.json({ error: "invalid url" });
    }

    try {
      // Verificar si la URL ya existe en la base de datos
      let existingUrl = await UrlShort.findOne({ original_url: url_input });

      if (existingUrl) {
        return res.json({ original_url: existingUrl.original_url, short_url: existingUrl.short_url });
      }

      // Obtener el último short_url para evitar duplicados
      const lastEntry = await UrlShort.findOne().sort({ short_url: -1 });
      const newShortUrl = lastEntry ? lastEntry.short_url + 1 : 1;

      // Guardar la nueva URL acortada
      const newUrl = new UrlShort({
        original_url: url_input,
        short_url: newShortUrl,
      });

      await newUrl.save();
      res.json({ original_url: newUrl.original_url, short_url: newUrl.short_url });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "server error" });
    }
  });
});

// **GET /api/shorturl/:short_url** - Redirige a la URL original
app.get("/api/shorturl/:short_url", async (req, res) => {
  const short_url = Number(req.params.short_url);

  if (isNaN(short_url)) {
    return res.json({ error: "Invalid short URL" });
  }

  try {
    const data = await UrlShort.findOne({ short_url });
    if (!data) {
      return res.json({ error: "No short URL found" });
    }

    // Redirigir a la URL original sin modificarla
    return res.redirect(data.original_url);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "server error" });
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
