const respond = (status = false,statusCode,data,res)=>{
    res.status(statusCode).json({
      status,
      message: "success",
      data,
    });

}


module.exports = respond;