const respond = (status = false,statusCode,data,res)=>{
    res.status(statusCode).json({
      status,
      data,
    });

}


module.exports = respond;