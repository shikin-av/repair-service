import { Router } from 'express'

// TODO model

export default () => {
    const api = Router()

    // TODO
    api.all('/', (req, res, next) => {
        res.json(req.data)
        //res.send('юзеры')
    })

    return api
}
