const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const usersRouter = require('./routes/users');
const cardsRouter = require('./routes/cards');
const { notFoundError } = require('./utils/constants');
const { login, createUser } = require('./controllers/users');

const { PORT = 3000 } = process.env;
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Temporary middleware
app.use((req, res, next) => {
  req.user = {
    _id: '646685615f48176fc5f63cfb', // вставьте сюда _id созданного в предыдущем пункте пользователя
  };

  next();
});

app.post('/signin', login);
app.post('/signup', createUser);

app.use('/users', usersRouter);
app.use('/cards', cardsRouter);
app.use((req, res) => {
  res.status(notFoundError).send({ message: 'Запрашиваемый ресурс не найден' });
});

// Start the server
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
