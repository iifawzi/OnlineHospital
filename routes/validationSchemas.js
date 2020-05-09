const Joi = require("@hapi/joi");
const addUser = Joi.object({
    username: Joi.string().required(),
    password: Joi.string().pattern(/^[a-zA-Z0-9]{3,30}$/).required(),
    first_name: Joi.string().required(),
    last_name: Joi.string().required(),
    province: Joi.string().required(),
    phone_number: Joi.number().required(),
  });
const signin = Joi.object({
  username: Joi.string().required(),
  password: Joi.string().required(),
})

const schemas = {
  addUser,
  signin,
}

module.exports = schemas;