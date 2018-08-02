import React from 'react'

const notification = require('antd/lib/notification')
require('antd/lib/notification/style/css')
const Button = require('antd/lib/button')
require('antd/lib/button/style/css')

const orderNotification = (order) => {
    //TODO action -> append to redux store (city, date!!!)
    const key = order.id
    const btn = (
        <Button 
            type='primary' 
            size='small' 
            onClick={ () => notification.close(key) }
        >
            <a href={ `/admin#/orders/city/${ order.cityNameUrl }/date/${ order.dateToLink }/id/${ order.id }` }>Открыть</a>
        </Button>
    )
    const category = order.categoryShortName
    const dateOptions = {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    }
    const date     = new Date(order.date)
    const dateFormatted = date.toLocaleDateString('ru-RU', dateOptions)    
    const time     = order.time ? `в ${ order.time }` : ''

    notification.open({
        message: `Заявка №${ order.id }`,
        description: `${ category } на ${ dateFormatted } ${ time }`,
        btn,
        key,
        duration: 0
    })
}

export default orderNotification