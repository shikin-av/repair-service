import { Router } from 'express'

import Category from '../models/Category'

export default () => {
    const api = Router()

    api.get('/', async (req, res, next) => {
        return await Category.find((err, categories) => {
            if(!err){
                return res.json(categories)
            } else {
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
                    return res.json(category)
                } else {
                    return next()
                }
            } else {
                return next(err)
            }
        })
    })

    api.post('/', async (req, res, next) => {
        const {
            name,
            singularName,
            nameUrl,
            shortName,
            image,
            problems
        } = req.body
        const category = new Category({
            name,
            singularName,
            nameUrl,
            shortName,
            image,
            problems : problems || []
        })
        return await category.save((err) => {
            if(!err) {
                return res.status(201).json(category)
            } else {
                return next(err)
            }
        })
    })

    api.put('/:nameUrl', async (req, res, next) => {
        const {
            name,
            singularName,
            nameUrl,
            shortName,
            image,
            problems
        } = req.body        
        return await Category.findOne({
            nameUrl: req.params.nameUrl
        }, (err, category) => {
            if(!err){
                if(!category){
                    return next()
                }
                category.name             = name || category.name
                category.singularName     = singularName || category.singularName
                category.nameUrl          = nameUrl || category.nameUrl
                category.shortName        = shortName || category.shortName
                category.image            = image || category.image
                category.problems         = problems || category.problems

                return category.save((err) => {
                    if(!err) {
                        return res.status(202).json(category)
                    } else {
                        return next(err)
                    }
                })
            } else {
                return next(err)
            }
        })
    })

    api.delete('/:nameUrl', async (req, res, next) => {
        return await Category.findOne({
            nameUrl: req.params.nameUrl
        }, (err, category) => {
            if(!err){
                if(!category){
                    return next()
                }
                return category.remove(err => {
                    if(!err){
                        return res.json({ status: 'OK' })
                    } else {
                        return next(err)
                    }
                })
            } else {
                return next(err)
            }
        })
    })

    return api
}
