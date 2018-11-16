import React from 'react'
import { connect } from 'react-redux'
import openSocket from 'socket.io-client'

import config from 'config/client'
import getCookie from 'client/admin/resources/getCookie'
import {
    getOrdersOptions as getOrdersOptionsSelector
} from 'client/admin/selectors/ordersOptions'
import {
    appendOrder as appendOrderAction
} from 'client/admin/actions/orders'

const notification = require('antd/lib/notification')
require('antd/lib/notification/style/css')
const Button = require('antd/lib/button')
require('antd/lib/button/style/css')
const message = require('antd/lib/message')
require('antd/lib/message/style/css')

class OrderNotification extends React.Component {
    constructor(props){
        super(props)
    }

    componentDidMount(){
        const authToken = getCookie('auth_token')
        if(authToken){
            const socket = openSocket()
            socket.on('connected', data => {
                socket.emit('adminAuthToken', authToken)

                socket.on('authorize', data => {})

                socket.on('errorMsg', data => {})

                socket.on('clientOrder', order => {
                    this.openNotification(order)
                })
            })
        }
    }

    openNotification(order){
        const { ordersOptions, appendOrderAction } = this.props
        const key = order.id
        const btn = (
            <Button
                type='primary'
                size='small'
                onClick={ () => notification.close(key) }
            >
                <a href={ `admin#/orders/date/${ order.dateToLink }/id/${ order.id }` }>Открыть</a>
            </Button>
        )
        const category = order.categoryShortName
        const dateOptions = {
            month: 'long',
            day: 'numeric'
        }
        const date     = new Date(order.date)
        const dateFormatted = date.toLocaleDateString('ru-RU', dateOptions)
        const time     = order.time ? `в ${ order.time }` : ''

        if(ordersOptions){  // order --> list
            const optionsKeys = Object.keys(ordersOptions)
            let discrepancy = false
            for(let i in optionsKeys){                
                const optionVal = ordersOptions[optionsKeys[i]]
                const orderVal  = order[optionsKeys[i]]
                if(orderVal != optionVal){
                    discrepancy = true
                }
            }
            if(discrepancy == false){
                appendOrderAction(order)
            }
        }


        notification.open({
            message: `Заявка №${ order.id }`,
            description: `${ category } на ${ dateFormatted } ${ time }`,
            btn,
            key,
            duration: 0
        })
    }

    render(){
        return null
    }
}

const mapStateToProps = state => ({
    ordersOptions: getOrdersOptionsSelector(state)
})

const mapDispatchToProps = {
    appendOrderAction
}

export default connect(mapStateToProps, mapDispatchToProps)(OrderNotification)
