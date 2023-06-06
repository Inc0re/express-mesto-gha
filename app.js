/* eslint-disable no-console */
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const usersRouter = require('./routes/users');
const cardsRouter = require('./routes/cards');
const { NotFoundError } = require('./utils/errors');
const { serverError } = require('./utils/constants');
const { login, createUser } = require('./controllers/users');
const auth = require('./middlewares/auth');
const { celebrate, errors } = require('celebrate');
const userValidator = require('./utils/validators/userValidator');

const { PORT = 3000 } = process.env;
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Unprotected routes
app.post('/signin', celebrate(userValidator.createOrLogin), login);
app.post('/signup', celebrate(userValidator.createOrLogin), createUser);

// Protected routes
app.use('/users', auth, usersRouter);
app.use('/cards', auth, cardsRouter);
app.use((req, res, next) => {
  next(new NotFoundError('Запрашиваемый ресурс не найден'));
});

// Celebrate errors
app.use(errors());

// Handle errors
app.use((err, req, res, next) => {
  const { statusCode = serverError, message } = err;

  res
    .status(statusCode)
    .send({
      message: statusCode === serverError
        ? 'На сервере произошла ошибка'
        : message,
    });

  next();
});

// Start the server
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
