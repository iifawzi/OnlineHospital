const validate = (schema, property,abortEarly = false)=>{
    return (req,res,next)=>{
        const {error} = schema.validate(req[property],{
            abortEarly,
        });
        const valid = error == null;
        if (valid){
            next();
        }else {
            const {details} = error;
            const message = details.map(detail=> detail.message);
            console.log("errors", message);
            res.status(400).json({errors:message});
        }
    }
}

module.exports = validate;