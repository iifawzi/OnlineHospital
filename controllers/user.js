const { ErrorHandler, handleError } = require("../middleware/error");
const respond = require("../middleware/respond");
const {genToken} = require("../utils/shared/genToken");
const {updateUser,checkIfPhoneExist} = require("../models/users");

const  updateInfo = async (req,res,next) => {
  try {
      const {phone_number} = req.user;
      const data = req.body;
const user = await checkIfPhoneExist(phone_number);
if (!user){
    throw new ErrorHandler(401,"Not Authorized");
}
if (data.phone_number != undefined){
const checkPhone = await checkIfPhoneExist(data.phone_number);
if (checkPhone){
  if (user.user_id != checkPhone.user_id){ // if a mistake happened and he send the same phone number which associated with his acc.
    throw new ErrorHandler(403,"The new Phone number is already registered");
  }
}
}
const updatedData = await updateUser(user,data);
if (!updatedData){
    throw new ErrorHandler(500,"Sorry, something wrong happened");
}
const token = genToken(updatedData.phone_number,updatedData.role); 
return respond(true,200,{...updatedData.dataValues,token},res);
  } catch (err) {
    handleError(err, res);
  }
};

module.exports = {
    updateInfo
};
