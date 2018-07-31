import { Router } from 'express'

import User from '../models/User'
import auth from '../resources/auth'

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

    api.post('/', async (req, res, next) => {
        const {
            login,
            password,
            role,
            fio,
            city,
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
            phone,
            workingDays: workingDays || [],
            categories:  categories  || []
        })
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
