const router = require('express').Router();

const {
  createCard,
  getCards,
  deleteCard,
  likeCard,
  dislikeCard,
} = require('../controllers/cards');

router.post('/', createCard);
router.get('/', getCards);
router.delete('/:cardId', deleteCard);
router.delete('/:cardId/likes', dislikeCard);
router.put('/:cardId/likes', likeCard);

module.exports = router;
