const {
  notFoundError, forbiddenError, badRequestError, serverError,
} = require('../utils/constants');
const Card = require('../models/card');

module.exports = (req, res, next) => {
  Card.findById(req.params.cardId)
    .then((card) => {
      if (!card) {
        res
          .status(notFoundError)
          .send({ message: `Нет карточки с id ${req.params.cardId}` });
      } else if (card.owner.toString() !== req.user._id) {
        res.status(forbiddenError).send({ message: 'Нет прав на удаление' });
      } else {
        next();
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
