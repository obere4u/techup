const Joi = require("joi");

const donorSchema = Joi.object({
  uid: Joi.string(),
  fullName: Joi.string().required(),
  email: Joi.string().email().required(),
  amount: Joi.string().allow(null,""),
  reference: Joi.string().allow(null, ""),
  currentAddress: Joi.string().required(),
  organizationName: Joi.string().allow(null, ""),
  organizationAddress: Joi.string().allow(null, ""),
  organizationWebsite: Joi.string().allow(null, ""),
  phone: Joi.string().required(),
  partnershipType: Joi.string().required(),
  comment:Joi.string().allow(null, ""),
  timestamp: Joi.date().timestamp().default(Date.now),
});

module.exports = donorSchema;
