const {ErrorHandler,handleError} = require("./error");
module.exports = (req, res, next) => {
  try {
      if (!req.admin){
          throw new ErrorHandler(401,"Not authorized");
      }else {
        if (req.admin.role != 'admin' && req.admin.role != 'superadmin'){
          throw new ErrorHandler(401,"Not authorized");
        }
        next();
      }
  } catch (err) {
    handleError(err, res);
  }
};
