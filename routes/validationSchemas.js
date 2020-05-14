const Joi = require("@hapi/joi");
const addUser = Joi.object({
    phone_number: Joi.string().pattern(/^01[0125]\d{8,8}$/),
    username: Joi.string().required(),
    password: Joi.string().pattern(/^[a-zA-Z0-9]{3,30}$/).required(),
    first_name: Joi.string().required(),
    last_name: Joi.string().required(),
    birth_date: Joi.date().required(),
    height: Joi.number().required(),
    weight: Joi.number().required(),
    bmi: Joi.number().required(),
    gender: Joi.string().required(),
    fb_token_id: Joi.string().required(),
  });
const signin = Joi.object({
  username: Joi.string().required(),
  password: Joi.string().required(),
});
const updateFirebaseToken = Joi.object({
  username:Joi.string().required(),
  new_token: Joi.string().required(),
})

const schemas = {
  addUser,
  signin,
  updateFirebaseToken,
}

module.exports = schemas;