const { ErrorHandler, handleError } = require("../middleware/error");
const respond = require("../middleware/respond");
const { genToken } = require("../utils/shared/genToken");
const { updateUser, checkIfPhoneExist } = require("../models/users");
const upload = require("../middleware/upload");
const updateInfo = async (req, res, next) => {
  try {
    const { phone_number } = req.user;
    const data = req.body;
    const user = await checkIfPhoneExist(phone_number);

    if (!user) {
      throw new ErrorHandler(401, "Not Authorized");
    }

    if (data.phone_number != undefined) {
      const checkPhone = await checkIfPhoneExist(data.phone_number);
      if (checkPhone) {
        if (user.user_id != checkPhone.user_id) {
          // if a mistake happened and he sent the same phone number which associated with his acc.
          throw new ErrorHandler(
            403,
            "The new Phone number is already registered"
          );
        }
      }
    }
    const updatedData = await updateUser(user, data);

    if (!updatedData) {
      throw new ErrorHandler(500, "Sorry, something wrong happened");
    }
    const token = genToken(updatedData.phone_number, updatedData.role);
    return respond(true, 200, { ...updatedData.dataValues, token }, res);
  } catch (err) {
    handleError(err, res);
  }
};


const notBlocked = async (req, res, next) => {
  try {
    const { phone_number } = req.user;
    const user = await checkIfPhoneExist(phone_number);
    if (!user) {
      throw new ErrorHandler(401, "You're Unauthorized");
    }
    if (user.blocked === true) {
      throw new ErrorHandler(403, "You're blocked");
    }
    return respond(true, 200, { blocked: false }, res);
  } catch (err) {
    handleError(err, res);
  }
};


const updateImage = async (req,res,next)=>{
  try {
    const {phone_number} = req.user;
    const user = await checkIfPhoneExist(phone_number);
    if (!user) {
      throw new ErrorHandler(401, "You're Unauthorized");
    }
      upload().single('file')(req,{},async error=>{
          if (error){
              handleError(error,res);
          }else {
              if (req.file){
                const data = {
                  picture: req.file.filename
                }
                const updatedData = await updateUser(user, data);
                if (!updatedData) {
                throw new ErrorHandler(500, "Sorry, something wrong happened");
                 }
                  return respond(true,200,{picture: req.file.filename},res)
              }else {
                throw new ErrorHandler(500, "Sorry, something wrong happened");

              }
          }
      }); 
  }catch(err){
      handleError(err,res);
  }
};


const getUser = async (req, res, next) => {
  try {
    const { phone_number } = req.body;
    const user = await checkIfPhoneExist(phone_number);
    if (!user) {
      throw new ErrorHandler(404, "User not found");
    }
    return respond(true, 200,user,res);
  } catch (err) {
    handleError(err, res);
  }
};

module.exports = {
  updateInfo,
  notBlocked,
  updateImage,
  getUser
};
