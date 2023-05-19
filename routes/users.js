const router = require('express').Router();

const {
  createUser,
  getUsers,
  getUserById,
  updateUser,
} = require('../controllers/users');

router.post('/', createUser);
router.get('/', getUsers);
router.get('/:id', getUserById);
router.patch('/me', updateUser);

module.exports = router;
