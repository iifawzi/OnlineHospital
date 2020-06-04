const jwt = require("jsonwebtoken");
const config = require("config");
const genToken = function (phone_number,id, role) {
    const encData = {
      phone_number,
      role,
      id
    };
    // data to be encrypted in the JSONWEBTOKEN.
    let token = "";
    if (role === "admin" || role === "moderator"){
      token =  jwt.sign(encData, config.get("jwt.secret"), {
        expiresIn: config.get("jwt.expiresInAdmins"),
      });
    }else {
      token =  jwt.sign(encData, config.get("jwt.secret"), {
        expiresIn: config.get("jwt.expiresIn"),
      });
    }
    return token;
  };

  module.exports = {
      genToken,
  }