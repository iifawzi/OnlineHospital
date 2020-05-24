const jwt = require("jsonwebtoken");
const { ErrorHandler, handleError } = require("./error");
const config = require("config");
const isAuth = (role)=>{
  return (req, res, next) => {
    const encoded_token = req.get("Authorization");
    if (!encoded_token) {
      throw new ErrorHandler(401, "User is not Authorized");
    } else {
      if (encoded_token.startsWith("Bearer ")) {
        // Remove Bearer from string
        var splicedToken = encoded_token.slice(7, encoded_token.length);
      }
      try {
        let decoded_token = jwt.verify(splicedToken, config.get("jwt.secret"));
        if (!decoded_token) {
          throw new ErrorHandler(401, "Not authorized");
        }
        if (role.includes(decoded_token.role)){
          req.user = {
            ...decoded_token,
          };
          return next();
        }else {
          throw new ErrorHandler(401, "Not authorized");
        }
      } catch (err) {
        err.statusCode = 401;
        handleError(err, res);
      }
    }
  };
}
 
module.exports = isAuth;