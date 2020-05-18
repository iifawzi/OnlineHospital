const {handleError,ErrorHandler} = require("../middleware/error");
const {checkDocPhoneExist,createNewDoctor} = require("../models/doctors");
const {checkAdminExist,createAdmin,genToken} = require("../models/admins");
const {hashPassword,compareHashed} = require("../utils/shared/bcrypt");

const respond = require("../middleware/respond");




const addDoctor = async (req,res,next)=>{
    try{
        const {first_name,last_name,phone_number,password,country,category,sub_category} = req.body;
        const Checkdoctors = await checkDocPhoneExist(phone_number);
        if (Checkdoctors){
            throw new ErrorHandler(403,"Phone Number is already associated with an account");
        }
        const hashedPassword = await hashPassword(password);
        const createDoctor = await createNewDoctor({
            first_name,
            last_name,
            password:hashedPassword,
            phone_number,
            country,
            category,
            sub_category,
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
        const {username, password, name, role} = req.body;
        const checkAdmin = await checkAdminExist(username);
        if(checkAdmin){
            throw new ErrorHandler(403,"Username is already associated with an Admin account");
        }
        const hashedPassword= await hashPassword(password);
        const createAdminAcc = await createAdmin({
            username,
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
        const {username, password} = req.body;
        const admin = await checkAdminExist(username);
        if (!admin){
            throw new ErrorHandler(401,"Admin with this username is not found");
        }
        const compared = await compareHashed(password,admin.password);
        if(!compared){
            throw new ErrorHandler(401,"Password is Incorrect");
        }
        const token = genToken(username,admin.role); 
        const respondedAdmin = {...admin.dataValues};
        delete respondedAdmin.password;
        return respond(true,200,{...respondedAdmin,token},res);
    }catch(err){
        handleError(err,res);
    }
}

module.exports = {
    addDoctor,
    addAdmin,
    signAdmin
}