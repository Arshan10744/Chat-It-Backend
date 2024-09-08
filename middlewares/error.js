const errorMiddleware = (err, req, res, next) =>{

    console.log("error middlewar called");
    err.message ||= "Internal Server Error";
    err.statusCode ||= 500;

    return res.status(err.statusCode).json({
        sucess: false,
        message: err.message,
    })
}

const TryCatch = (passedFunction) => async (req, res, next) =>{
    try {
        await passedFunction(req, res, next)
    } catch (error) {
        next(error)
    }
}

export {errorMiddleware, TryCatch}