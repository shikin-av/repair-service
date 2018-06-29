export default (err, req, res, next) => {
    console.log({ error: err, stack: err.stack })
    let status = 500
    const isNotFound = ~err.message.indexOf('not found')
    const isCastErr = ~err.message.indexOf('Cast to ObjectId fail')
    const isValidationErr = err.message.indexOf('validation')
    const isUniqueErr = err.message.indexOf('unique')
    const isAccessDenied = err.message.indexOf('access denied')

    if(err.message){
        if(isNotFound || isCastErr){
            next()  // go to 404 error handler
        }else if(isValidationErr || isUniqueErr || isAccessDenied){
            status = 400
        }
        res.status(status).json(err.message)
    }else{
        res.status(status).json(err)
    }
}
