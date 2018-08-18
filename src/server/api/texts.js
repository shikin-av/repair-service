import { Router } from 'express'

import Text from '../models/Text'

export default () => {
    const api = Router()

    api.get('/', async (req, res, next) => {
        return await Text.find((err, cities) => {
            if(!err){
                return res.json(cities)
            } else {
                return next(err)
            }
        })
    })

    api.get('/:nameUrl', async (req, res, next) => {
        return await Text.findOne({
            nameUrl: req.params.nameUrl
        }, (err, text) => {
            if(!err){
                if(text){
                    return res.json(text)
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
            title,
            content,
            nameUrl,
        } = req.body
        const text = new Text({
            title,
            content,
            nameUrl,
        })
        return await text.save(err => {
            if(!err) {
                console.log(`text "${ nameUrl }" created`)
                return res.status(201).json(text)
            } else {
                return next(err)
            }
        })
    })

    api.put('/:nameUrl', async (req, res, next) => {
        const {
            title,
            content,
            nameUrl,
        } = req.body
        return await Text.findOne({
            nameUrl: req.params.nameUrl
        }, (err, text) => {
            if(!err){
                if(!text){
                    console.log(`text "${ req.params.nameUrl }" not found`)
                    return next()
                }
                text.title    = title   || text.title
                text.content  = content || text.content
                text.nameUrl  = nameUrl || text.nameUrl

                return text.save((err) => {
                    if(!err) {
                        console.log(`text "${ nameUrl }" updated`)
                        return res.status(202).json(text)
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
        return await Text.findOne({
            nameUrl: req.params.nameUrl
        }, (err, text) => {
            if(!err){
                if(!text){
                    console.log(`text "${ req.params.nameUrl }" not found`)
                    return next()
                }
                return text.remove(err => {
                    if(!err){
                        console.log(`text "${ req.params.nameUrl }" deleted`)
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