export default (req, res, next) => {
    res.status(404).send({ error: '404 - Not found' })
}
