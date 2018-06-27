import { AsyncRouter } from 'express-async-router'
import { Router } from 'express'
import models from '../models'

export default () => {
    //const api = AsyncRouter()
    const api = Router()

    api.all('/', (req, res) => ({}))

    api.get('/categories', async (req, res, next) => {
        return await models.Category.find((err, categories) => {
            if(!err){
                return res.send(categories)
            }else{
                return next(err)
            }
        })
    })

    api.get('/categories/:nameUrl', async (req, res, next) => {
        return await models.Category.findOne({
            nameUrl: req.params.nameUrl
        }, (err, category) => {
            if(!err){
                if(category){
                    return res.send(category)
                }else{
                    next()
                }
            }else{
                return next(err)
            }
        })

    })

    api.post('/categories', async (req, res, next) => {
        const {
            name,
            nameUrl,
            image,
            problems
        } = req.body
        const category = new models.Category({
            name,
            nameUrl,
            image,
            problems : problems || []
        })
        return await category.save((err) => {
            if(!err) {
                console.log('category created')
                return res.status(201).json(category)
            } else {
                return next(err)
            }
        })
    })

    api.put('/categories/:id', (req, res) => {
        res.send(req.body)
    })

    api.delete('/categories/:id', (req, res) => {
        res.send(req.body)
    })

    return api
}
