const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const {
  serverError,
  badRequestError,
  notFoundError,
  unauthorizedError,
  saltRounds,
  mongoDuplicateKeyError,
  createdStatus,
  jwtSecret,
} = require('../utils/constants');

// Errors: 500 - server error
const getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch((err) => res.status(serverError).send({ message: err.message }));
};

// Errors: 400 - bad request, 404 - not found, 500 - server error
const getUser = (id, res) => {
  User.findById(id)
    .then((user) => {
      if (!user) {
        res
          .status(notFoundError)
          .send({ message: `Не найден пользователь с id ${id}` });
        return;
      }
      res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res
          .status(badRequestError)
          .send({ message: `Некорректный id пользователя ${id}` });
      }
      return res.status(serverError).send({ message: err.message });
    });
};

const getUserById = (req, res) => {
  getUser(req.params.id, res);
};

const getUserByMe = (req, res) => {
  getUser(req.user, res);
};

// Errors: 400 - bad request, 500 - server error
const createUser = (req, res) => {
  const {
    email, password, name, about, avatar,
  } = req.body;

  bcrypt
    .hash(password, saltRounds)
    .then((hash) => User.create({
      email,
      password: hash,
      name,
      about,
      avatar,
    }))
    .then((user) => {
      // send user without password
      res
        .status(createdStatus)
        .send({
          data: {
            email: user.email,
            name: user.name,
            about: user.about,
            avatar: user.avatar,
          },
        });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(badRequestError).send({
          message: 'Переданы некорректные данные при создании пользователя',
        });
      }
      if (err.code === mongoDuplicateKeyError) {
        return res.status(badRequestError).send({
          message: 'Пользователь с таким email уже существует',
        });
      }
      return res.status(serverError).send({ message: err.message });
    });
};

// Errors: 400 - bad request, 404 - not found, 500 - server error
const updateUser = (req, res) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    {
      new: true,
      runValidators: true,
      upsert: false,
    },
  )
    .then((user) => {
      if (!user) {
        return res
          .status(notFoundError)
          .send({ message: `Не найден пользователь с id ${req.user._id}` });
      }
      return res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(badRequestError).send({
          message: 'Переданы некорректные данные при обновлении профиля',
        });
      }
      return res.status(serverError).send({ message: err.message });
    });
};

// Errors: 400 - bad request, 404 - not found, 500 - server error
const updateUserAvatar = (req, res) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    {
      new: true,
      runValidators: true,
      upsert: false,
    },
  )
    .then((user) => {
      if (!user) {
        return res
          .status(notFoundError)
          .send({ message: `Не найден пользователь с id ${req.user._id}` });
      }
      return res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(badRequestError).send({
          message: 'Переданы некорректные данные при обновлении аватара',
        });
      }
      return res.status(serverError).send({ message: err.message });
    });
};

// Errors: 400 - bad request, 500 - server error
const login = (req, res) => {
  const { email, password } = req.body;
  User.findUserByCredentials(email, password)
    .then((user) => {
      // res.send({ token: jwt.sign({ _id: user._id }, jwtSecret, { expiresIn: '7d' }) });
      const token = jwt.sign({ _id: user._id }, jwtSecret, { expiresIn: '7d' });
      res.cookie('token', token, {
        httpOnly: true,
      });
      res.status(200).send({ message: 'Авторизация прошла успешно' });
    })
    .catch((err) => {
      res.status(unauthorizedError).send({ message: err.message });
      console.log(err);
    });
};

module.exports = {
  getUsers,
  getUserById,
  getUserByMe,
  createUser,
  updateUser,
  updateUserAvatar,
  login,
};
