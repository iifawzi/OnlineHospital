const Joi = require("@hapi/joi");
const addDoctor = Joi.object({
    name: Joi.string().required(),
    password: Joi.string().required(),
  });

const schemas = {
    addDoctor,
}

module.exports = schemas;