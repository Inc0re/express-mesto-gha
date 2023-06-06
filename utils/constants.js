const { JWT_SECRET = 'super-secret-key' } = process.env;

module.exports = {
  badRequestError: 400,
  notFoundError: 404,
  forbiddenError: 403,
  conflictError: 409,
  serverError: 500,
  unauthorizedError: 401,
  createdStatus: 201,
  mongoDuplicateKeyError: 11000,
  saltRounds: 10,
  jwtSecret: JWT_SECRET,
};
