const Joi = require("joi");

const talentSchema = Joi.object({
  fullName: Joi.string().min(3).required(),
  email: Joi.string().email().required(),
  phoneNumber: Joi.string().required(),
  gender: Joi.string().required(),
  dateOfBirth: Joi.string().required(),
  educationQualification: Joi.string().required(),
  stateOfResidence: Joi.string().required(),
  LGAOfResidence: Joi.string().required(),
  currentAddress: Joi.string().required(),
  portfolioLink: Joi.string().allow(null, ""),
  programOfChoice: Joi.string().required(),
  experienceLevel: Joi.string().required(),
  haveLaptop: Joi.string().required(),
  haveInternet: Joi.string().required(),
  timestamp: Joi.date().timestamp().default(Date.now),
  isAdmitted: Joi.bool().default(false),
  createdAt: Joi.alternatives().try(
    Joi.date().timestamp(),
    Joi.string().allow("")
  ),
  updatedAt: Joi.alternatives().try(
    Joi.date().timestamp(),
    Joi.string().allow("")
  ),
  testScore: Joi.number().allow(null),
  __v: Joi.number(),
  number: Joi.number(),
  password: Joi.string()
    .allow("")
    .pattern(
      /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*?[0-9])(?=.*?[!@#$%^&*+`~'=?|.:;_=^{}/\][()\-<>/]).{6,}$/
    )
    .messages({
      "string.pattern.base":
        "Password must contain at least one lowercase and one uppercase letter, one special character, and be at least 6 characters long",
    }),
  isWeekCompleted: Joi.array()
    .items(
      Joi.object({
        week: Joi.number().required(),
        completed: Joi.bool().required(),
      })
    )
    .required(),
});

module.exports = talentSchema;
