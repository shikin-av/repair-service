import { Router } from 'express'
import _ from 'lodash'
import moment from 'moment'

import City from '../models/City'
import Category from '../models/Category'
import Order from '../models/Order'
import getRandomInt from '../resources/getRandomInt'

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
                const result = categories.map(category => {
                    return _.pick(category, ['name', 'nameUrl', 'image'])
                })
                return res.json(result)
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

    api.post('/orders', async (req, res, next) => {
        const { 
            date,
            time,
            firm,
            howOld,
            problems,
            description,
            address,
            phone,
            name,
            city,
            categoryShortName
        } = req.body
        //console.log('ORDER req.body ', req.body)

        const minInt = 0
        const maxInt = 10000
        const id = getRandomInt(minInt, maxInt)    // xxxx number
                
        const beginDay    = moment(date).startOf('day')
        const endDay      = moment(beginDay).endOf('day')
                
        // make id be unique of current day
        Order.find({
            date: {
                $gte: beginDay.toDate(),
                $lt:  endDay.toDate()
            }
        }, (err, orders) => {
            if(err){
                return next(err)
            } else {                
                if(orders){
                    return orders        
                } else return []
            }
        })
        .then(orders => {
            if(!orders.length){
                return id
            } else {
                let ids = orders.map(order => {
                    return order.id
                })
                const makeDifferValueFromArray = (val, arr, callbackForVal) => {
                    const match = _.findIndex(arr, item => {
                        return item == val
                    })
                    if(match == -1){    // not match
                        return val      //it is unique
                    } else {
                        const newVal = callbackForVal(val)
                        makeDifferValueFromArray(newVal, arr, callbackForVal)
                    }
                }
                return makeDifferValueFromArray(id, ids, (val) => {
                    return getRandomInt(minInt, maxInt)
                })
            }
        })
        .then(id => {
            const order = new Order({
                id:                 id,   
                date:               date        || new Date(),
                time:               time        || null,
                firm:               firm        || null,
                howOld:             howOld      || null,
                problems:           problems    || [],
                description:        description || null,
                address,
                phone,
                name,
                city,
                categoryShortName:  categoryShortName,
                status:             'new',
                
            })
            return order.save(err => {
                if(!err){
                    console.log(`order "${ id }" created`)
                    return res.status(201).json({
                        status: 'OK',
                        order: order
                    })
                } else return next(err)
            })
        })
    })
    return api
}