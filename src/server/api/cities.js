import { Router } from 'express'

import City from '../models/City'

export default () => {
    const api = Router()

    api.get('/', async (req, res, next) => {        
        return await City.find((err, cities) => {
            if(!err){
                return res.json(cities)
            } else {
                return next(err)
            }
        })
    })

    api.get('/:nameUrl', async (req, res, next) => {
        return await City.findOne({
            nameUrl: req.params.nameUrl
        }, (err, city) => {
            if(!err){
                if(city){
                    return res.json(city)
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
            nameUrl,
            phone,
            officeAddress
        } = req.body
        const city = new City({
            name,
            nameUrl,
            phone,
            officeAddress
        })
        if(req.app.get('demoUser')){
            return res.status(201).json(city)
        }
        return await city.save((err) => {
            if(!err) {
                return res.status(201).json(city)
            } else {
                return next(err)
            }
        })
    })

    api.put('/:nameUrl', async (req, res, next) => {
        const {
            name,
            nameUrl,
            phone,
            officeAddress
        } = req.body
        return await City.findOne({
            nameUrl: req.params.nameUrl
        }, (err, city) => {
            if(!err){
                if(!city){
                    return next()
                }
                city.name     = name || city.name
                city.nameUrl  = nameUrl || city.nameUrl
                city.phone    = phone || city.phone
                city.officeAddress = officeAddress || city.officeAddress

                if(req.app.get('demoUser')){
                    return res.status(202).json(city)
                }
                return city.save((err) => {
                    if(!err) {
                        return res.status(202).json(city)
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
        return await City.findOne({
            nameUrl: req.params.nameUrl
        }, (err, city) => {
            if(!err){
                if(!city){
                    return next()
                }
                
                if(req.app.get('demoUser')){
                    return res.json({ status: 'OK' })
                }
                return city.remove(err => {
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