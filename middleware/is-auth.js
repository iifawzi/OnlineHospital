const jwt = require("jsonwebtoken");
const { ErrorHandler, handleError } = require("./error");
const config = require("config");
const isAuth = (role)=>{
  return (req, res, next) => {
    const encoded_token = req.headers.authorization;
    if (!encoded_token) {
      throw new ErrorHandler(401, "User is not Authorized");
    } else {
      if (encoded_token.startsWith("Bearer ")) {
        // Remove Bearer from string
        var spliced = encoded_token.split(' ');
        var splicedToken = spliced[1];
      }else {
        var splicedToken = encoded_token;
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
        console.log(err);
        err.statusCode = 401;
        handleError(err, res);
      }
    }
  };
}
 
module.exports = isAuth;