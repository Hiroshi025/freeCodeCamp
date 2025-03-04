const express = require('express');
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

app.use(cors());
app.use(express.static('public'));
app.use(express.json());  // Asegúrate de usar express.json para manejar JSON
app.use(express.urlencoded({ extended: true }));

// Conectar a la base de datos de MongoDB (suponiendo que usas MongoDB para el almacenamiento)
mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});


// Crear el modelo de usuario
const userSchema = new mongoose.Schema({
  username: String,
  exercises: [{
    description: String,
    duration: Number,
    date: { type: Date, default: Date.now }
  }]
});

const User = mongoose.model('UserFreeCamp', userSchema);

// Ruta para la página principal
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html');
});

// Crear un nuevo usuario
app.post('/api/users', async (req, res) => {
  const uname = req.body.uname || req.body.username;
  const user = new User({ username: uname });
  await user.save();
  res.json({ username: user.username, _id: user._id }); // Se devuelve el objeto con 'username' y '_id'
});

// Obtener todos los usuarios
app.get('/api/users', async (req, res) => {
  const users = await User.find();
  res.json(users.map(user => ({ username: user.username || user.uname, _id: user._id }))); // Se asegura que solo 'username' y '_id' son devueltos
});

app.post('/api/users/:_id/exercises', async (req, res) => {
  const { description, duration, date } = req.body;
  const dateOfExercise = date ? new Date(date) : new Date();
  const user = await User.findById(req.params._id);
  
  if (user) {
    const exercise = { description, duration, date: dateOfExercise };
    user.exercises.push(exercise);
    await user.save();
    
    // Crear el log de ejercicios si no existe
    if (!user.log) {
      user.log = [];
    }

    // Agregar el ejercicio al log
    user.log.push({
      description,
      duration,
      date: dateOfExercise.toDateString(),
    });
    await user.save();
    
    /**
     * Ejemplo de respuesta esperada:
     * {
     *   username: "fcc_test",
     *   count: 1,
     *   _id: "5fb5853f734231456ccb3b05",
     *   log: [{
     *     description: "test",
     *     duration: 60,
     *     date: "Mon Jan 01 1990",
     *   }]
     * }
     */

    res.json({
      username: user.username,
      description,
      duration: Number(duration),
      date: dateOfExercise.toDateString(),
      _id: user._id
    });
  } else {
    res.status(404).send('User not found');
  }
});


// Obtener log de ejercicios de un usuario
app.get('/api/users/:_id/logs', async (req, res) => {
  const { from, to, limit } = req.query;
  const user = await User.findById(req.params._id);

  if (user) {
    let logs = user.exercises;

    // Filtrar por fecha de 'from' (desde)
    if (from) {
      logs = logs.filter(exercise => new Date(exercise.date) >= new Date(from));
    }
    // Filtrar por fecha de 'to' (hasta)
    if (to) {
      logs = logs.filter(exercise => new Date(exercise.date) <= new Date(to));
    }
    // Limitar el número de registros
    if (limit) {
      logs = logs.slice(0, parseInt(limit));
    }

    // Modificar el formato de los logs para cumplir con los requisitos
    const formattedLogs = logs.map(exercise => ({
      description: exercise.description,
      duration: exercise.duration,
      date: exercise.date.toDateString() // Usando el formato de fecha requerido
    }));

    res.json({
      _id: user._id,
      username: user.username,
      count: formattedLogs.length, // La propiedad 'count' representa el número de ejercicios
      log: formattedLogs // Devolver los ejercicios con el formato adecuado
    });
  } else {
    res.status(404).send('User not found');
  }
});

// Iniciar el servidor
const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port);
});