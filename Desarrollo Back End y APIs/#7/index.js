const express = require('express');
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

app.use(cors());
app.use(express.static('public'));
app.use(express.json());  // Asegúrate de usar express.json para manejar JSON

// Conectar a la base de datos de MongoDB (suponiendo que usas MongoDB para el almacenamiento)
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/exercise-log', {
  useNewUrlParser: true,
  useUnifiedTopology: true
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

const User = mongoose.model('User', userSchema);

// Ruta para la página principal
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html');
});

// Crear un nuevo usuario
app.post('/api/users', async (req, res) => {
  const { username } = req.body;
  const user = new User({ username });
  await user.save();
  res.json({ username: user.username, _id: user._id });
});

// Obtener todos los usuarios
app.get('/api/users', async (req, res) => {
  const users = await User.find();
  res.json(users);
});

// Añadir ejercicio a un usuario
app.post('/api/users/:_id/exercises', async (req, res) => {
  const { description, duration, date } = req.body;
  const dateOfExercise = date ? new Date(date) : new Date();
  const user = await User.findById(req.params._id);
  
  if (user) {
    const exercise = { description, duration, date: dateOfExercise };
    user.exercises.push(exercise);
    await user.save();
    res.json(user);
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

    if (from) {
      logs = logs.filter(exercise => new Date(exercise.date) >= new Date(from));
    }
    if (to) {
      logs = logs.filter(exercise => new Date(exercise.date) <= new Date(to));
    }
    if (limit) {
      logs = logs.slice(0, parseInt(limit));
    }

    res.json({
      _id: user._id,
      username: user.username,
      count: logs.length,
      log: logs
    });
  } else {
    res.status(404).send('User not found');
  }
});

// Iniciar el servidor
const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port);
});
