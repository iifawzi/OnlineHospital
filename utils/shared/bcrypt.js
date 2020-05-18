const bcrypt = require("bcrypt");
const config = require("config");

// bcrypt Related Functions: 

// Hash the Password
const hashPassword = async function (password){
    const hashedPassword = await bcrypt.hash(password,config.get("bcrypt.saltRounds"));
    return hashedPassword;
    };
    // Compare Hashed Password:
    const compareHashed = async function(password,hashedPassword){
        const compareResult = await bcrypt.compare(password,hashedPassword);
        return compareResult;
    }


    module.exports = {
        hashPassword,
        compareHashed
    }