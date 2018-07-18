import { Router } from 'express'
import _ from 'lodash'

import Category from '../models/Category'

export default () => {
    const api = Router()

    api.get('/', async (req, res, next) => {
        return await Category.find((err, categories) => {
            if(!err){
                return res.json(categories)
                /*const result = categories.map(category => {
                    return _.pick(category, ['name', 'nameUrl', 'shortName', 'image'])
                })*/
                return res.json(result)
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
                console.log(`category "${ nameUrl }" created`)
                return res.status(201).json(category)
            } else {
                return next(err)
            }
        })
    })

    api.put('/:nameUrl', async (req, res, next) => {
        const {
            name,singularName,
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
                    console.log(`category "${ req.params.nameUrl }" not found`)
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
                        console.log(`category "${ nameUrl }" updated`)
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
                    console.log(`category "${ req.params.nameUrl }" not found`)
                    return next()
                }
                return category.remove(err => {
                    if(!err){
                        console.log(`category "${ req.params.nameUrl }" deleted`)
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
