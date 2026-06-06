async function errorMiddleware(err,req,res,next){
    return res.status(401).send({
        message: err.message
    })
}

export default errorMiddleware
