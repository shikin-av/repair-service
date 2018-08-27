import { Router } from 'express'

import User from '../models/User'

export default () => {
    const api = Router()
    
    api.get('/', async (req, res, next) => {
        return await User.find((err, users) => {
            if(!err){
                return res.json(users)
            } else {
                return next(err)
            }
        })
    })

    api.get('/:login', async (req, res, next) => {
        return await User.findOne({
            login: req.params.login
        }, (err, user) => {
            if(!err){
                if(user){
                    return res.json(user)
                } else {
                    return next()
                }
            } else {
                return next(err)
            }
        })
    })

    // for OrderEdit page
    api.get('/city/:cityNameUrl/category/:categoryNameUrl/day/:dayCyrilic', async (req, res, next) => {
        const { cityNameUrl, categoryNameUrl, dayCyrilic } = req.params
        const decodedDay = decodeURI(dayCyrilic)        
        return await User.find({
            role:             'работник',
            cityNameUrl:      cityNameUrl,
            categories:       categoryNameUrl,
            workingDays:      decodedDay 
        },(err, users) => {
            if(!err){
                return res.json(users)
            } else {
                return next(err)
            }
        })
    })    

    // for OrdersFilter
    api.get('/city/:cityNameUrl/day/:dayCyrilic', async (req, res, next) => {
        const { cityNameUrl, dayCyrilic } = req.params
        const decodedDay = decodeURI(dayCyrilic)        
        return await User.find({
            role:             'работник',
            cityNameUrl:      cityNameUrl,
            workingDays:      decodedDay 
        },(err, users) => {
            if(!err){
                return res.json(users)
            } else {
                return next(err)
            }
        })
    })

    api.post('/', async (req, res, next) => {
        const {
            login,
            password,
            role,
            fio,
            city,
            cityNameUrl,
            phone,
            workingDays,
            categories
        } = req.body
        const user = new User({
            login,
            password,
            fio,
            role : role || 'worker',
            city,
            cityNameUrl,
            phone,
            workingDays: workingDays || [],
            categories:  categories  || []
        })

        if(req.app.get('demoUser')){
            return res.status(201).json(user)
        }
        return await user.save(err => {
            if(!err){
                return res.status(201).json(user)
            } else {
                return next(err)
            }
        })
    })

    api.put('/:login', async (req, res, next) => {
        const {
            login,
            password,
            role,
            fio,
            city,
            cityNameUrl,
            phone,
            workingDays,
            categories
        } = req.body
        return await User.findOne({
            login: req.params.login
        }, (err, user) => {
            if(err) return next(err)
            if(!user) {
                return next()
            } else {
                user.login       = login       || user.login
                user.password    = password    || user.password
                user.fio         = fio         || user.fio
                user.role        = role        || user.role
                user.city        = city        || user.city
                user.phone       = phone       || user.phone
                user.workingDays = workingDays || user.workingDays
                user.categories  = categories  || user.categories
                user.cityNameUrl = cityNameUrl || user.cityNameUrl

                if(req.app.get('demoUser')){
                    return res.status(202).json(user)
                }
                return user.save(err => {
                    if(err) return next(err)
                    return res.status(202).json(user)
                })
            }
        })
    })

    api.delete('/:login', async (req, res, next) => {
        return await User.findOne({
            login: req.params.login
        }, (err, user) => {
            if(!err){
                if(!user){
                    return next()
                } else {

                    if(req.app.get('demoUser')){
                        return res.json({ status: 'OK' })
                    }
                    return user.remove(err => {
                        if(!err){
                            return res.json({ status: 'OK' })
                        } else {
                            return next(err)
                        }
                    })
                }
            } else {
                return next(err)
            }
        })
    })

    return api
}
