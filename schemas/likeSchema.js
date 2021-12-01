const Joi = require("joi");

const likeSchema = Joi.object().keys({
    id: Joi.string().required()
});

module.exports = likeSchema;