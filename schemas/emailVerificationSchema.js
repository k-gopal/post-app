const Joi = require("joi");

const emailVerificationSchema = Joi.object().keys({
    email: Joi.string().required()
});

module.exports = emailVerificationSchema;