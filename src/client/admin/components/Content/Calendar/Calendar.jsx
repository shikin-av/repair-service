import React from 'react'
import moment from 'moment'
import _ from 'lodash'

const CalendarAnt = require('antd/lib/calendar')
require('antd/lib/calendar/style/css')
const Badge = require('antd/lib/badge')
require('antd/lib/badge/style/css')

import getCookie from 'client/admin/resources/getCookie'
import config from 'config/client'
import {
    getOrdersByCityDatePerMonth as getOrdersByCityDatePerMonthApi
} from 'client/admin/api/orders'

import LoadedContentView from 'client/admin/components/content/LoadedContentView/LoadedContentView.jsx'

import l from './Calendar.less'

class Calendar extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            loadStatus: 'load',
            ordersPerMonth: null
        }
        this.userCityNameUrl = null
    }

    async componentWillMount(){
        this.userCityNameUrl = getCookie('userCityNameUrl')
        const currentDayString = moment().format(config.date.dateLinkFormat)
        const ordersPerMonth = await this.getOrdersPerMonth(currentDayString)
        if(!ordersPerMonth.error){
            this.setState({ 
                ordersPerMonth,
                loadStatus: 'complete'
            })
        } else {
            this.setState({ loadStatus: 'empty' })
        }
    }    

    async onPanelChange(date, mode){
        const currentDayString = moment(date).format(config.date.dateLinkFormat)
        const ordersPerMonth = await this.getOrdersPerMonth(currentDayString)
        if(!ordersPerMonth.error){
            this.setState({ 
                ordersPerMonth,
                loadStatus: 'complete'
            })
        } else {
            this.setState({ loadStatus: 'empty' })
        }
    }

    getOrdersPerMonth(dateString){
        return getOrdersByCityDatePerMonthApi(this.userCityNameUrl, dateString)
    }

    getOrdersPerDay(dateString){
        const { ordersPerMonth } = this.state
        let ordersPerDay = []
        
        if(ordersPerMonth){
            const ordersMonthToDay = ordersPerMonth.filter(order => {
                return order.dateToLink == dateString
            })        
            if(ordersMonthToDay){
                ordersPerDay = ordersMonthToDay   
            }
        }
                
        return ordersPerDay
    }

    dateCellRender(date){   // calling in all days
        const currentDayString = date.format(config.date.dateLinkFormat)
        const ordersPerDay = this.getOrdersPerDay(currentDayString)
        return (
            <ul className='events'>
            {
                ordersPerDay.length ?
                ordersPerDay.map(order => {
                    let status = null
                    switch(order.status){
                        case 'new': 
                            status = 'error'
                            break
                        case 'working': 
                            status = 'warning'
                            break
                        case 'complete': 
                            status = 'success'
                            break
                    }
                    return (
                        <li key={ order._id }>
                            <Badge 
                                status={ status }
                                text={ order.id }
                            />
                        </li>
                    )
                })
                : null
            }
            </ul>
        )
    }

    onDateSelect(date){
        const currentDayString = date.format(config.date.dateLinkFormat)
        window.location.replace(`/admin#/orders/date/${ currentDayString }`)
    }

    render(){
        const { loadStatus, ordersPerMonth } = this.state
        return (
            <LoadedContentView
                loadStatus={ loadStatus }
                message='Ошибка загрузки календаря заявок'
            >      
            {
                ordersPerMonth ?                 
                <CalendarAnt 
                    onPanelChange={ (date, mode) => this.onPanelChange(date, mode) } 
                    dateCellRender={ date => this.dateCellRender(date) }
                    onSelect={ date => this.onDateSelect(date) }
                    className={ l.root }
                />    
                : <span></span>
            }
            </LoadedContentView>      
        )
    }
}

export default Calendar