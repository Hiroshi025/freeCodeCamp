require('dotenv').config();
const mongoose = require('mongoose');

let Person;
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

/**
 * 
 * 
Crea un esquema de persona llamado personSchema con la siguiente forma:

Un campo name obligatorio de tipo String
Un campo age de tipo Number
Un campo favoriteFoods de tipo [String]
Usa los tipos básicos de esquemas de Mongoose. Si quieres también puedes añadir más campos, utilizar validadores sencillos como required o unique, y establecer valores por defecto. Mira nuestro artículo sobre Mongoose .
 */

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  age: Number,
  favoriteFoods: [String]
})

Person = mongoose.model('Person', personSchema);

const createAndSavePerson = (done) => {
  const person = new Person({name: 'Miguel', age: 25, favoriteFoods: ['Pizza', 'Hamburguer']});
  person.save(function (err, data) {
    if (err) return done(err);
    done(null, data);
  });
};

const createManyPeople = (arrayOfPeople, done) => {
  Person.create(arrayOfPeople, function (err, data) {
    if (err) return done(err);
    done(null, data);
  });
};

const findPeopleByName = (personName, done) => {
  // Usamos el método find() de Mongoose con un objeto de consulta
  Person.find({ name: "test"}, function (err, personFound) {
    if (err) return done(err);  // Devolvemos el error si ocurre uno
    done(null, personFound);    // Si no hay error, devolvemos los resultados encontrados
  });
};
const findOneByFood = (food, done) => {
  /**
   * Modifica la función findOneByFood para encontrar una sola persona que tenga cierta comida en los favoritos de la persona, usando Model.findOne() -> Person. Usa el argumento de función food como clave de búsqueda.
   */

  Person.findOne({ favoriteFoods: food }, function (err, data) {
    if (err) return done(err);
    done(null, data);
  });
};

const findPersonById = (personId, done) => {
  /**
   * Modifica findPersonById para encontrar la única persona que tenga una determinada _id, usando Model.findById() -> Person. Utiliza el argumento de la función personId como clave de búsqueda.
   */

  Person.findById(personId, function (err, data) {
    if (err) return done(err);
    done(null, data);
  });
};

const findEditThenSave = (personId, done) => {
  const foodToAdd = "hamburger";

  /**
   * Modifica la función findEditThenSave para encontrar a una persona por _id (usa cualquiera de los métodos anteriores) con el parámetro personId como la clave de búsqueda. Añade "hamburger" a la lista de favoriteFoods (puedes usar Array.push()). Luego - dentro del callback de búsqueda: save() la Person actualizada.
   * Nota: Esto puede ser complicado, si está en tu esquema, declaraste favoriteFoods como un arreglo, sin especificar el tipo (por ejemplo [String]). En ese caso, favoriteFoods por defecto es de tipo Mixto, y tienes que marcarlo manualmente como editado usando document.markModified('edited-field'). Mira nuestro artículo sobre Mongoose .
   */

  Person.findOne({ _id: personId }, function (err, person) {
    if (err) return done(err);
    person.favoriteFoods.push(foodToAdd);
    person.save(function (err, data) {
      if (err) return done(err);
      done(null, data);
    });
  });

};

const findAndUpdate = (personName, done) => {
  const ageToSet = 20;

  done(null /*, data*/);
};

const removeById = (personId, done) => {
  done(null /*, data*/);
};

const removeManyPeople = (done) => {
  const nameToRemove = "Mary";

  done(null /*, data*/);
};

const queryChain = (done) => {
  const foodToSearch = "burrito";

  done(null /*, data*/);
};

/** **Well Done !!**
/* You completed these challenges, let's go celebrate !
 */

//----- **DO NOT EDIT BELOW THIS LINE** ----------------------------------

exports.PersonModel = Person;
exports.createAndSavePerson = createAndSavePerson;
exports.findPeopleByName = findPeopleByName;
exports.findOneByFood = findOneByFood;
exports.findPersonById = findPersonById;
exports.findEditThenSave = findEditThenSave;
exports.findAndUpdate = findAndUpdate;
exports.createManyPeople = createManyPeople;
exports.removeById = removeById;
exports.removeManyPeople = removeManyPeople;
exports.queryChain = queryChain;
