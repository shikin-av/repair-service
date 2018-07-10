import { Router } from 'express'

import City from '../models/City'
import Category from '../models/Category'

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

    api.get('/categories', async (req, res, next) => {
        return await Category.find((err, categories) => {
            if(!err){
                return res.json(categories)
            } else {
                return next(err)
            }
        })
    })
    
    api.get('/categories/:nameUrl', async (req, res, next) => {
        return await Category.findOne({
            nameUrl: req.params.nameUrl
        }, (err, category) => {
            if(!err){
                if(category){
                    return res.json(category)
                } else {
                    return next()
                }
            } else {
                return next(err)
            }
        })
    })

    return api
}