import { Router } from 'express'
import _ from 'lodash'

import City from '../models/City'
import Category from '../models/Category'
import Order from '../models/Order'

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
        const id = Math.random()    //TODO id on Order

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
        return await order.save(err => {
            if(!err){
                console.log(`order "${ id }" created`)
                return res.status(201).json({
                    status: 'OK',
                    order: order
                })
            } else return next(err)
        })

        /*return await Category.findOne({
            nameUrl: categoryNameUrl
        }, async (err, category) => {
            if(!err){
                if(category){

                    const id = Math.random()    //TODO

                    const order = new Order({
                        id: id,
                        date:        date        || new Date(),
                        time:        time        || null,
                        firm:        firm        || null,
                        howOld:      howOld      || null,
                        problems:    problems    || [],
                        description: description || null,
                        address,
                        phone,
                        name,
                        city,
                        category: category._id,
                        status:      'new',
                        
                    })
                    return await order.save(err => {
                        if(!err){
                            console.log(`order created`)
                            return res.status(201).json({
                                id: id,
                                categoryName: category.shortName
                            })
                        } else return next(err)
                    })
                } else {
                    return res.status(404).json('error')
                }
            } else {
                return res.status(404).json('error')
            }
        })*/
    })
    return api
}