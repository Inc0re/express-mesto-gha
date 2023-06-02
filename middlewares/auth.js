const jwt = require('jsonwebtoken');
const { jwtSecret } = require('../utils/constants');
const { unauthorizedError } = require('../utils/constants');

const handleAuthError = (res) => {
  res
    .status(unauthorizedError)
    .send({ message: 'Необходима авторизация' });
};

// eslint-disable-next-line consistent-return
module.exports = (req, res, next) => {
  const { token } = req.cookies;

  if (!token) {
    return handleAuthError(res);
  }

  let payload;

  try {
    payload = jwt.verify(token, jwtSecret);
  } catch (err) {
    return handleAuthError(res);
  }

  req.user = payload;

  next();
};
