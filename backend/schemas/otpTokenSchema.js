const Joi = require("joi");

const otpTokenSchema = Joi.object({
  token: Joi.string().required(),
  createdAt: Joi.date().default(Date.now),
  userId: Joi.string().hex(),
});

module.exports = otpTokenSchema;
