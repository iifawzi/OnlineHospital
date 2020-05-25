const {handleError,ErrorHandler} = require("../middleware/error");
const {checkDocPhoneExist,createNewDoctor,getDoctorsPanel,deleteDoctor} = require("../models/doctors");
const {checkAdminExist,createAdmin} = require("../models/admins");
const {getAllCategories} = require("../models/categories");
const {genToken} = require("../utils/shared/genToken");
const {hashPassword,compareHashed} = require("../utils/shared/bcrypt");
const respond = require("../middleware/respond");
const upload = require("../middleware/upload");
const fs = require('fs')

const addImage = async (req,res,next)=>{
    try {
        upload().single('file')(req,{},async error=>{
            if (error){
                handleError(error,res);
            }else {
                if (req.file){
                    return respond(true,201,{filename: req.file.filename},res)
                }else {
            throw new ErrorHandler(500,"Something wrong happened");

                }
            }
        }); 
    }catch(err){
        handleError(err,res);
    }
};



const addDoctor = async (req,res,next)=>{
    try{
        const {first_name,last_name,phone_number,password,country,category_id,picture,price} = req.body;
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
            country,
            category_id,
            picture,
            price
        });
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
        });
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
        const token = genToken(phone_number,admin.role); 
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
        const admin = await checkAdminExist(phone_number);
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
        const categories = await getAllCategories();
        return respond(true,200,categories,res); 
    }catch(err){
        handleError(err,res);
    }
}



const getDoctors = async(req,res,next)=>{
    try {
const doctors = await getDoctorsPanel();
return respond(true,200,doctors,res); 
    }catch(err){
        handleError(err,res);
    }
}

const deleteTheDoctor = async(req,res,next)=>{
    try {
        const {phone_number} = req.body;
const deletedDoctor = await deleteDoctor(phone_number);
if (deletedDoctor){
    return respond(true,200,deletedDoctor,res); 

}else {
    throw new ErrorHandler(404,"Doctor not found");
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
    deleteTheDoctor
}