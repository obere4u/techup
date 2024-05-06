const Joi = require("joi");

const adminSchema = Joi.object({
  fullName: Joi.string().required(),
  email: Joi.string().email().required(),
  phoneNumber: Joi.string().required(),
  role: Joi.string().required(),
  gender: Joi.string().required(),
  password: Joi.string()
    .allow("")
    .pattern(
      /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*?[!@#$%^&*+`~'=?|.:;_=^{}/\][()\-<>/]).{6,}$/
    )
    .messages({
      "string.pattern.base":
        "Password must contain at least one lowercase and one uppercase letter, one special character, and be at least 6 characters long",
    }),
});

module.exports = adminSchema;
