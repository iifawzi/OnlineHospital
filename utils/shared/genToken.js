const jwt = require("jsonwebtoken");
const config = require("config");
const genToken = function (phone_number, role) {
    const encData = {
      phone_number,
      role,
    };
    // data to be encrypted in the JSONWEBTOKEN.
    return jwt.sign(encData, config.get("jwt.secret"), {
      expiresIn: config.get("jwt.expiresInAdmins"),
    });
  };

  module.exports = {
      genToken,
  }