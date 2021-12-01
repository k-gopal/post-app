const Joi = require("joi");

const listPostSchema = Joi.object().keys({
    sort: Joi.string().required(),
    sortStyle: Joi.number().required(),
    page: Joi.number().required(),
    limit: Joi.number().required()
});

module.exports = listPostSchema;