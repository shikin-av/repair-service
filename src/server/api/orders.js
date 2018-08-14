import { Router } from 'express'
import moment from 'moment'

import Order from  '../models/Order'
import sms from '../resources/sms'
import smsConfig from '../../config/smsc.ru'

export default () => {
    const api = Router()

    api.get('/city/:cityNameUrl', async (req, res, next) => {
        return await Order.find({
            cityNameUrl: req.params.cityNameUrl
        })
        .sort({ date: -1 })
        .exec((err, orders) => {
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
            })
            .sort({ date: -1 })
            .exec((err, orders) => {
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
            dateToLink,
            dateToView,
            time,
            description,
            address,
            apartment,
            phone,
            name,
            worker,
            status,
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

                        const saveToDb = async order => {                            
                            return await order.save(err => {
                                if(!err) {
                                    console.log(`order "${ order.id }" updated`)
                                    return res.json(order)
                                } else {
                                    return next(err)
                                }
                            })
                        }

                        order.date            = date        || order.date
                        order.dateToLink      = dateToLink  || order.dateToLink
                        order.dateToView      = dateToView  || order.dateToView
                        order.time            = time        || order.time
                        order.description     = description || order.description
                        order.address         = address     || order.address
                        order.apartment       = apartment   || order.apartment
                        order.phone           = phone       || order.phone
                        order.name            = name        || order.name
                        order.status          = status      || order.status
                        order.workerId        = worker._id  || order.workerId                    
                                                
                        if(order.smsStatus != 'sended'){
                            const smsMessage = sms.makeSmsOrderMessage(order)                        
                            try {
                                sms.send_sms({
                                phones: worker.phone,
                                mes: smsMessage,
                                sender: smsConfig.companyNameForSms,
                                charset: 'utf-8',
                                }, (data, raw, err, code) => {
                                    if(err){
                                        console.log('sms ERROR:', err, 'code: ' + code)  
                                        order.workerId  = null                                        
                                        order.status    = 'new'                                      
                                        switch(code){
                                            case 1: 
                                                order.smsError = 'Ошибка в параметрах отправки смс'
                                                break
                                            case 2: 
                                                order.smsError = 'Ошибка авторизации в смс-сервисе'
                                                break
                                            case 3: 
                                                order.smsError = 'Недостаточно средств для отправки смс'
                                                break
                                            case 4: 
                                                order.smsError = 'IP-адрес временно заблокирован из-за частых ошибок в запросах'
                                                break
                                            case 5: 
                                                order.smsError = 'Неверный формат даты'
                                                break
                                            case 6: 
                                                order.smsError = 'Сообщение запрещено (по тексту или по имени отправителя)'
                                                break
                                            case 7:
                                                order.smsError = 'Неверный формат номера телефона'
                                                console.log('CASE 7: order.smsError', order.smsError)
                                                break
                                            case 8: 
                                                order.smsError = 'Сообщение на указанный номер не может быть доставлено'
                                                break
                                            case 9: 
                                                order.smsError = 'Повторите отправку смс через минуту'
                                                break
                                            default: 
                                                order.smsError = 'Неизвестная ошибка отправки смс'                                                
                                        }
                                        console.log(`SMS error: ORDER 
                                        ${order}`
                                        )                                        
                                        return res.json(order)
                                        
                                    } else {
                                        console.log('sms DATA: ', data)
                                        order.smsStatus = 'sended'
                                        return saveToDb(order)
                                    }
                                })    
                            } catch(err){
                                console.log('ERROR', err)
                                order.smsStatus = 'error'
                                order.status    = 'new'
                                order.workerId  = null
                                return res.json(order)                           
                            }                        
                        } else {
                            return saveToDb(order)    
                        }                        
                    }                    
                } else {
                    return next(err)
                }
            })
        }
    })

    return api
}