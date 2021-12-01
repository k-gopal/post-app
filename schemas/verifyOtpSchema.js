const Joi = require("joi");

const verifyOtpSchema = Joi.object().keys({
    email: Joi.string().required(),
    otp: Joi.number().required()
});

module.exports = verifyOtpSchema;