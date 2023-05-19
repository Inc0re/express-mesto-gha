const router = require('express').Router();

const { createCard, getCards, deleteCard, likeCard } = require('../controllers/cards');

router.post('/', createCard);
router.get('/', getCards);
router.delete('/:cardId', deleteCard);
router.put('/:cardId/likes', likeCard);

module.exports = router;
