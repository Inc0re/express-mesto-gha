const User = require('../models/user');

// Errors: 500 - server error
const getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch((err) => res.status(500).send({ message: err.message }));
};

// Errors: 400 - bad request, 404 - not found, 500 - server error
const getUserById = (req, res) => {
  User.findById(req.params.id)
    .then((user) => {
      if (!user) {
        res
          .status(404)
          .send({ message: `Не найден пользователь с id ${req.params.id}` });
        return;
      }
      res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res
          .status(400)
          .send({ message: `Некорректный id пользователя ${req.params.id}` });
      }
      return res.status(500).send({ message: err.message });
    });
};

// Errors: 400 - bad request, 500 - server error
const createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(400).send({
          message: 'Переданы некорректные данные при создании пользователя',
        });
      }
      return res.status(500).send({ message: err.message });
    });
};

//
const updateUser = (req, res) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    {
      new: true,
      runValidators: true,
      upsert: true,
    },
  )
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(400).send({
          message: 'Переданы некорректные данные при обновлении профиля',
        });
      }
      return res.status(500).send({ message: err.message });
    });
};

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateUser,
};
