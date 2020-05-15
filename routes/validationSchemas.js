const Joi = require("@hapi/joi");
const addUser = Joi.object({
    phone_number: Joi.string(),
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
  phone_number: Joi.string().required(),
});
const updateFirebaseToken = Joi.object({
  phone_number:Joi.string().required(),
  new_token: Joi.string().required(),
});
const getFirebaseToken = Joi.object({
  phone_number:Joi.string().required(),
});

const schemas = {
  addUser,
  signin,
  updateFirebaseToken,
  getFirebaseToken,
}

module.exports = schemas;