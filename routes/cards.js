const router = require('express').Router();
const { celebrate } = require('celebrate');
const checkCardOwner = require('../middlewares/check-card-owner');
const cardValidator = require('../utils/validators/cardValidator');

const {
  createCard,
  getCards,
  deleteCard,
  likeCard,
  dislikeCard,
} = require('../controllers/cards');

router.post('/', celebrate(cardValidator.createCard), createCard);
router.get('/', getCards);
router.delete('/:cardId', checkCardOwner, deleteCard);
router.delete('/:cardId/likes', dislikeCard);
router.put('/:cardId/likes', likeCard);

module.exports = router;
