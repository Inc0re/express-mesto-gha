const User = require('../models/user');

const badRequestError = 400;
const notFoundError = 404;
const serverError = 500;

// Errors: 500 - server error
const getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch((err) => res.status(serverError).send({ message: err.message }));
};

// Errors: 400 - bad request, 404 - not found, 500 - server error
const getUserById = (req, res) => {
  User.findById(req.params.id)
    .then((user) => {
      if (!user) {
        res
          .status(notFoundError)
          .send({ message: `Не найден пользователь с id ${req.params.id}` });
        return;
      }
      res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res
          .status(badRequestError)
          .send({ message: `Некорректный id пользователя ${req.params.id}` });
      }
      return res.status(serverError).send({ message: err.message });
    });
};

// Errors: 400 - bad request, 500 - server error
const createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(badRequestError).send({
          message: 'Переданы некорректные данные при создании пользователя',
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

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  updateUserAvatar,
};
