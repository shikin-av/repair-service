export default (req, res, next) => {
    //const isApiRequest 		 = ~req.originalUrl.indexOf('/api')
    //const isPublicApiRequest = ~req.originalUrl.indexOf('/publicapi')
    //console.log('req.originalUrl', req.originalUrl)
    //(isApiRequest || isPublicApiRequest) ? res.status(404).send({ error: '404 - Not found' }) : res.redirect('/#/404')
    res.status(404).send({ error: '404 - Not found' })
}
