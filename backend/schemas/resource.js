const Joi = require("joi");

const resourceSchema = Joi.object({
  week: Joi.number().required(),
  program: Joi.string().required(),
  course: Joi.object({
    title: Joi.string().required(),
    links: Joi.array()
      .items(
        Joi.object({
          linkTitle: Joi.string().required(),
          linkUrl: Joi.string().required(),
        })
      )
      .required(),
  }).required(),
  assignments: Joi.array()
    .items(
      Joi.object({
        assignmentUrl: Joi.string().required().allow(""),
        assignmentTitle: Joi.string().required().allow(""),
      })
    )
    .required(),
  timestamp: Joi.date().timestamp().default(Date.now),
});

module.exports = resourceSchema;
