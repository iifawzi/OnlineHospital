const {hashPassword} = require("./shared/bcrypt");
const {checkAdminExist,createAdmin} = require("../models/admins");




module.exports = async function() {
 const admin = await checkAdminExist("01090243795");
 if (!admin){
    await createAdmin({
         phone_number:"01090243795",
         password: await hashPassword("12qwaszx"),
         name:"Fawzi E. Abdulfattah",
         role:"admin"
        })
 }
};



