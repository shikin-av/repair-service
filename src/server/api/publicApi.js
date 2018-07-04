import { Router } from 'express'

import City from '../models/City'

export default () => {
    const api = Router()

    api.get('/cities', async (req, res, next) => {
        return await City.find((err, cities) => {
            if(!err){
                return res.json(cities)
            } else {
                return next(err)
            }
        })
    })
    
    return api
}