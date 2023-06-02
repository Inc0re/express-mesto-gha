const router = require('express').Router();

const {
  getUsers,
  getUserById,
  getUserByMe,
  updateUser,
  updateUserAvatar,
} = require('../controllers/users');

router.get('/', getUsers);
router.get('/me', getUserByMe);
router.get('/:id', getUserById);
router.patch('/me', updateUser);
router.patch('/me/avatar', updateUserAvatar);

module.exports = router;
