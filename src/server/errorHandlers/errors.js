export default (err, req, res, next) => {
    const isApiRequest = ~req.originalUrl.indexOf('/api')
    let status = 500
    const isNotFound      = ~err.message.indexOf('not found')
    const isCastErr       = ~err.message.indexOf('Cast to ObjectId fail')
    const isValidationErr = ~err.message.indexOf('validation')
    const isUniqueErr     = ~err.message.indexOf('unique')
    const isAccessDenied  = ~err.message.indexOf('access denied')
    const isJwtExpired    = ~err.message.indexOf('jwt expired')

    if(err.message){
        if(isNotFound || isCastErr){
            next()  // go to 404 error handler
        }else if(isValidationErr || isUniqueErr){
            isApiRequest ? res.status(status).json(err.message) : res.redirect('/#/404')
        }else if(isAccessDenied || isJwtExpired){
            isApiRequest ? res.status(status).json(err.message) : res.redirect('/#/login')
        }
    }else{
        isApiRequest ? res.status(status).json(err) : res.redirect('/#/404')
    }
}
