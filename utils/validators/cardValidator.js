const { Joi } = require('celebrate');
const { urlTemplate } = require('../constants');

module.exports = {
  createCard: {
    body: Joi.object().keys({
      name: Joi.string().required().min(2).max(30),
      link: Joi.string().required().pattern(urlTemplate),
    }),
  },
};
