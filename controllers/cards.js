const Card = require('../models/card');

const badRequestError = 400;
const notFoundError = 404;
const serverError = 500;

// Errors: 500 - server error
const getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.send({ data: cards }))
    .catch((err) => res.status(serverError).send({ message: err.message }));
};

// Errors: 400 - bad request, 500 - server error
const createCard = (req, res) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(badRequestError).send({
          message: 'Переданы некорректные данные при создании карточки',
        });
      } else {
        res.status(serverError).send({ message: err.message });
      }
    });
};

// Errors: 404 - not found, 500 - server error
const deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
    .then((card) => {
      if (!card) {
        res
          .status(notFoundError)
          .send({ message: `Нет карточки с id ${req.params.cardId}` });
      } else {
        res.send({ data: card });
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res
          .status(badRequestError)
          .send({ message: `Некорректный id карточки ${req.params.cardId}` });
      } else {
        res.status(serverError).send({ message: err.message });
      }
    });
};

// Errors: 400 - bad request, 404 - not found, 500 - server error
const likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        res
          .status(notFoundError)
          .send({ message: `Нет карточки с id ${req.params.cardId}` });
      } else {
        res.send({ data: card });
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(badRequestError).send({
          message: 'Переданы некорректные данные для постановки лайка',
        });
      } else {
        res.status(serverError).send({ message: err.message });
      }
    });
};

// Errors: 400 - bad request, 404 - not found, 500 - server error
const dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        res
          .status(notFoundError)
          .send({ message: `Нет карточки с id ${req.params.cardId}` });
      } else {
        res.send({ data: card });
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(badRequestError).send({
          message: 'Переданы некорректные данные для снятия лайка',
        });
      } else {
        res.status(serverError).send({ message: err.message });
      }
    });
};

module.exports = {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
};
