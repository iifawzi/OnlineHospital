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
  category_id: Joi.number().required(),
  picture: Joi.string().required(),
  price: Joi.number().required(),
});
const addAdmin = Joi.object({
password: Joi.string().pattern(/^[a-zA-Z0-9]{3,30}$/).required(),
phone_number: Joi.string().required(),
name: Joi.string().required(),
role: Joi.string(),
});
const signAdmin = Joi.object({
  phone_number: Joi.string().required(),
    password: Joi.string().required(),
});
const getDoctor = Joi.object({
  doctor_id: Joi.number().required(),
});
const getDoctors = Joi.object({
  category_id: Joi.number().required(),
});
const updateUser = Joi.object({
  phone_number: Joi.string(),
    first_name: Joi.string(),
    last_name: Joi.string(),
    birth_date: Joi.date(),
    height: Joi.number(),
    weight: Joi.number(),
    bmi: Joi.number(),
    gender: Joi.string(),
});
const updateDoctor = Joi.object({
  doctor_id: Joi.number().required(),
  phone_number: Joi.string(),
  password: Joi.string().pattern(/^[a-zA-Z0-9]{3,30}$/),
  first_name: Joi.string(),
  last_name: Joi.string(),
  country: Joi.string(),
  category_id: Joi.number(),
  picture: Joi.string(),
  price: Joi.number(),
  avaliable: Joi.boolean(),
});
const deleteDoctor = Joi.object({
  phone_number: Joi.string().required(),
});
const getUser = Joi.object({
  phone_number: Joi.string().required(),
});
const toggleBlock = Joi.object({
  phone_number: Joi.string().required(),
});
const addSlot = Joi.object({
 doctor_id: Joi.number().required(),
 day: Joi.string().required(),
 start_time: Joi.string().required(),
 end_time: Joi.string().required(),
 slot_time: Joi.string().required(),
 available: Joi.boolean().required(),
});
const getDoctorDays = Joi.object({
  doctor_id: Joi.number().required(),
 });
 const addAppointment = Joi.object({
  slot_id: Joi.number().required(),
  user_id: Joi.number().required(),
  date: Joi.string().required(),
 });
 const getAppointments = Joi.object({
  doctor_id: Joi.number().required(),
  day: Joi.string().required(),
  date: Joi.string().required(),
 });
const schemas = {
  addUser,
  signin,
  updateFirebaseToken,
  signdoctor,
  addDoctor,
  addAdmin,
  signAdmin,
  getDoctor,
  getDoctors,
  updateUser,
  updateDoctor,
  deleteDoctor,
  getUser,
  toggleBlock,
  addSlot,
  getDoctorDays,
  addAppointment,
  getAppointments
}

module.exports = schemas;