import { Router } from 'express'

import Category from '../models/Category'

export default () => {
    const api = Router()

    api.get('/', async (req, res, next) => {
        return await Category.find((err, categories) => {
            if(!err){
                return res.send(categories)
            }else{
                return next(err)
            }
        })
    })

    api.get('/:nameUrl', async (req, res, next) => {
        return await Category.findOne({
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

    api.post('/', async (req, res, next) => {
        const {
            name,
            nameUrl,
            image,
            problems
        } = req.body
        const category = new Category({
            name,
            nameUrl,
            image,
            problems : problems || []
        })
        return await category.save((err) => {
            if(!err) {
                console.log(`category "${ nameUrl }" created`)
                return res.status(201).json(category)
            } else {
                return next(err)
            }
        })
    })

    api.put('/:nameUrl', async (req, res, next) => {
        const {
            name,
            nameUrl,
            image,
            problems
        } = req.body
        return await Category.findOne({
            nameUrl: req.params.nameUrl
        }, (err, category) => {
            if(!category){
                console.log(`category "${ req.params.nameUrl }" not found`)
                return next(err)
            }
            category.name = name || category.name
            category.nameUrl = nameUrl || category.nameUrl
            category.image = image || category.image
            category.problems = problems || category.problems

            return category.save((err) => {
                if(!err) {
                    console.log(`category "${ nameUrl }" updated`)
                    return res.status(202).json(category)
                } else {
                    return next(err)
                }
            })
        })
    })

    api.delete('/:nameUrl', async (req, res, next) => {
        return await Category.findOne({
            nameUrl: req.params.nameUrl
        }, (err, category) => {
            if(!category){
                console.log(`category "${ req.params.nameUrl }" not found`)
                return next(err)
            }
            return category.remove(err => {
                if(!err){
                    console.log(`category "${ req.params.nameUrl }" deleted`)
                    return res.send({ status: 'OK' })
                } else {
                    next(err)
                }
            })
        })
    })

    return api
}
