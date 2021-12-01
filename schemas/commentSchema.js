const Joi = require("joi");

const commentSchema = Joi.object().keys({
    id: Joi.string().required(),
    comment: Joi.string().required()
});

module.exports = commentSchema;