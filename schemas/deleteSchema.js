const Joi = require("joi");

const deleteSchema = Joi.object().keys({
    id: Joi.string().required()
});

module.exports = deleteSchema;