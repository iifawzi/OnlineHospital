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
const signdoctor = Joi.object({
  phone_number: Joi.string().required(),
  password: Joi.string().required(),
});
const updateFirebaseToken = Joi.object({
  new_token: Joi.string().required(),
});
const addDoctor = Joi.object({
  phone_number: Joi.string().required(),
  password: Joi.string().pattern(/^[a-zA-Z0-9]{3,30}$/).required(),
  first_name: Joi.string().required(),
  last_name: Joi.string().required(),
  country: Joi.string().required(),
  category: Joi.string().required(),
  sub_category: Joi.string(),
});
const addAdmin = Joi.object({
password: Joi.string().pattern(/^[a-zA-Z0-9]{3,30}$/).required(),
username: Joi.string().required(),
name: Joi.string().required(),
role: Joi.string(),
});
const signAdmin = Joi.object({
    username: Joi.string().required(),
    password: Joi.string().required(),
});

const schemas = {
  addUser,
  signin,
  updateFirebaseToken,
  signdoctor,
  addDoctor,
  addAdmin,
  signAdmin
}

module.exports = schemas;