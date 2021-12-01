const Joi = require("joi");

const postSchema = Joi.object().keys({
    title: Joi.string().required(),
    desc: Joi.string(),
    comments: Joi.string(),
    likes: Joi.string()
});

module.exports = postSchema;