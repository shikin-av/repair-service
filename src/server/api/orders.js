import { Router } from 'express'
import moment from 'moment'

import Order from  '../models/Order'

export default () => {
    const api = Router()

    api.get('/city/:cityNameUrl', async (req, res, next) => {
        return await Order.find({
            cityNameUrl: req.params.cityNameUrl
        },(err, orders) => {
            if(!err){
                return res.json(orders)
            } else {
                return next(err)
            }
        })
    })

    api.get('/city/:cityNameUrl/date/:dateString', async (req, res, next) => {
        const { cityNameUrl, dateString } = req.params
        // :date    'yyyy-mm-dd' || 'yyyy-m-d'
        const date = new Date(dateString)
        if(date == 'Invalid Date'){
            return res.json({ error: 'Invalid Date' })
        } else {
            const beginDay    = moment(date).startOf('day')
            const endDay      = moment(beginDay).endOf('day')

            return await Order.find({
                cityNameUrl: cityNameUrl,
                date: {
                    $gte: beginDay.toDate(),
                    $lt:  endDay.toDate()
                }
            },(err, orders) => {
                if(!err){
                    return res.json(orders)
                } else {
                    return next(err)
                }
            })
        }
    })

    api.get('/city/:cityNameUrl/date/:dateString/id/:id', async (req, res, next) => {
        const { cityNameUrl, dateString, id } = req.params
        const orderDate = new Date(dateString)
        if(orderDate == 'Invalid Date'){
            return res.json({ error: 'Invalid Date' })
        } else {
            const beginDay    = moment(orderDate).startOf('day')
            const endDay      = moment(beginDay).endOf('day')

            return await Order.findOne({
                cityNameUrl: cityNameUrl,
                date: {
                    $gte: beginDay.toDate(),
                    $lt:  endDay.toDate()
                },
                id: id
            },(err, order) => {
                if(!err){
                    if(!order){
                        return next()
                    } else {
                        return res.json(order)
                    }
                } else {
                    return next(err)
                }
            })
        }
    })

    // for Edit page
    api.put('/city/:cityNameUrl/date/:dateString/id/:id', async (req, res, next) => {
        const { cityNameUrl, dateString, id } = req.params
        const { 
            date,
            time,
            description,
            address,
            phone,
            worker,
            workerLogin,
            status
        } = req.body
        const orderDate = new Date(dateString)
        if(orderDate == 'Invalid Date'){
            return res.json({ error: 'Invalid Date' })
        } else {
            const beginDay    = moment(orderDate).startOf('day')
            const endDay      = moment(beginDay).endOf('day')

            return await Order.findOne({
                cityNameUrl: cityNameUrl,
                date: {
                    $gte: beginDay.toDate(),
                    $lt:  endDay.toDate()
                },
                id: id
            },(err, order) => {
                if(!err){
                    if(!order){
                        return next()
                    } else {
                        order.date            = date        || order.date
                        order.time            = time        || order.time
                        order.description     = description || order.description
                        order.address         = address     || order.address
                        order.phone           = phone       || order.phone
                        if(order.status == 'new'){
                            order.status      = status      || order.status
                            order.worker      = worker      || order.worker
                            order.workerLogin = workerLogin || order.workerLogin
                        }
                        return order.save((err) => {
                            if(!err) {
                                console.log(`order "${ order.id }" updated`)
                                return res.status(202).json(order)
                            } else {
                                return next(err)
                            }
                        })
                    }
                    
                } else {
                    return next(err)
                }
            })
        }
    })

    return api
}