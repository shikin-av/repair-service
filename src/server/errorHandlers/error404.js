export default (req, res, next) => {
    const isApiRequest = ~req.originalUrl.indexOf('/api')
    isApiRequest ? res.status(404).send({ error: '404 - Not found' }) : res.redirect('/#/404')
    
}
