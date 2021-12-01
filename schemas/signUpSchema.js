const Joi = require("joi");

const signUpSchema = Joi.object().keys({
    firstName: Joi.string().required(),
    lastName: Joi.string().required()
});

module.exports = signUpSchema;