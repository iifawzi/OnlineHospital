const {handleError,ErrorHandler} = require("../middleware/error");
const {checkDocPhoneExist,createNewDoctor,getDoctorsPanel,deleteDoctor} = require("../models/doctors");
const {getDocSlots} = require("../models/slots");
const {checkAdminExist,createAdmin} = require("../models/admins");
const {getAllCategories} = require("../models/categories");
const {checkIfPhoneExist } = require("../models/users");
const {genToken} = require("../utils/shared/genToken");
const {cancelAppsByUser} = require("../models/appointments");
const {hashPassword,compareHashed} = require("../utils/shared/bcrypt");
const respond = require("../middleware/respond");
const upload = require("../middleware/upload");
const fs = require('fs')
var moment = require('moment'); // require




const addImage = async (req,res,next)=>{
    try {
        upload().single('file')(req,{},async error=>{
            if (error){
                handleError(error,res);
            }else {
                if (req.file){
                    return respond(true,201,{filename: req.file.filename},res)
                }else {
            const error = new ErrorHandler(500,"Something wrong happened");
            handleError(error,res);
                }
            }
        }); 
    }catch(err){
        handleError(err,res);
    }
};






const addDoctor = async (req,res,next)=>{
    try{
        const {first_name,last_name,phone_number,password,category_id,picture,price} = req.body;
        const Checkdoctors = await checkDocPhoneExist(phone_number);
        if (Checkdoctors){
            const filePath = "./uploadedImages/"+picture;
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
              }
            throw new ErrorHandler(403,"Phone Number is already associated with an account");
        }
        // const hashedPassword = await hashPassword(password);
        const createDoctor = await createNewDoctor({
            first_name,
            last_name,
            password,
            phone_number,
            category_id,
            picture,
            price
        },res);
        if (createDoctor){
            const doctor = {...createDoctor.dataValues};
            delete doctor.password;
            return respond(true,201,{...doctor},res);
        }
    }catch(err){
        handleError(err,res);
    }
};






const addAdmin = async (req,res,next)=>{
    try{
        const {phone_number, password, name, role} = req.body;
        const checkAdmin = await checkAdminExist(phone_number);
        if(checkAdmin){
            throw new ErrorHandler(403,"Phone Number is already associated with an Admin account");
        }
        const hashedPassword= await hashPassword(password);
        const createAdminAcc = await createAdmin({
            phone_number,
            password: hashedPassword,
            name,
            role
        },res);
        if(createAdminAcc) {
            const admin = {...createAdminAcc.dataValues};
            delete admin.password;
            return respond(true,201,{...admin},res);
        }
    }catch(err){
        handleError(err,res);
    }
};







const signAdmin = async (req,res,next)=>{
    try{
        const {phone_number, password} = req.body;
        const admin = await checkAdminExist(phone_number);
        if (!admin){
            throw new ErrorHandler(401,"Admin  is not found");
        }
        const compared = await compareHashed(password,admin.password);
        if(!compared){
            throw new ErrorHandler(401,"Password is Incorrect");
        }
        const token = genToken(phone_number,admin.admin_id,admin.role); 
        const respondedAdmin = {...admin.dataValues};
        delete respondedAdmin.password;
        return respond(true,200,{...respondedAdmin,token},res);
    }catch(err){
        handleError(err,res);
    }
};







const checkToken = async (req,res,next)=>{
    try {
        const {phone_number} = req.user
        const admin = await checkAdminExist(phone_number,res);
        if (!admin){
         throw new ErrorHandler(401,"You're Unauthorized");
     };
     const respondedAdmin = {...admin.dataValues};
     delete respondedAdmin.password;
     delete respondedAdmin.admin_id;
     return respond(true,200,{...respondedAdmin},res);
    }catch(err){
        handleError(err,res);
    }
}






const getCategories = async (req,res,next)=>{
    try {
        const categories = await getAllCategories(res);
        return respond(true,200,categories,res); 
    }catch(err){
        handleError(err,res);
    }
}






const getDoctors = async(req,res,next)=>{
    try {
const doctors = await getDoctorsPanel(res);
return respond(true,200,doctors,res); 
    }catch(err){
        handleError(err,res);
    }
}





const deleteTheDoctor = async(req,res,next)=>{
    try {
        const {phone_number} = req.body;
const deletedDoctor = await deleteDoctor(phone_number,res);
if (deletedDoctor){
    return respond(true,200,deletedDoctor,res); 

}else {
    throw new ErrorHandler(404,"Doctor not found");
}
    }catch(err){
        handleError(err,res);
    }
}




// toggle user's blocked coulmn (block / unblock user):
const toggleBlock = async (req, res, next) => {
    try {
      const { phone_number } = req.body;
      const user = await checkIfPhoneExist(phone_number);
      if (!user) {
        throw new ErrorHandler(404, "User not found");
      }
      if (user.blocked === false){
await cancelAppsByUser(user.user_id);
      }
      user.blocked = !user.blocked;
      await user.save();
      return respond(true, 200,user,res);
    } catch (err) {
      handleError(err, res);
    }
  };
  

  
const getDoctorSlots = async (req,res,next)=>{
    try {
        const {doctor_id} = req.body;
        const slots = await getDocSlots(doctor_id,res);
        if (slots){
            return respond(true,200,slots,res);
        }
    }catch(err){
        handleError(err,res);
    }
}




module.exports = {
    addDoctor,
    addAdmin,
    signAdmin,
    checkToken,
    addImage,
    getCategories,
    getDoctors,
    deleteTheDoctor,
    toggleBlock,
    getDoctorSlots,
}