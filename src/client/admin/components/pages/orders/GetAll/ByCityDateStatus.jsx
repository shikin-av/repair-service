import React from 'react'
import { connect } from 'react-redux'
import moment from 'moment'
import _ from 'lodash'

import {
    getOrdersByCityDateStatus as getOrdersByCityDateStatusAction
 } from 'client/admin/actions/orders'
 import {
     getOrders as getOrdersSelector
} from 'client/admin/selectors/orders'
import {
    setOrdersOptions as setOrdersOptionsAction
} from 'client/admin/actions/ordersOptions'

import GetAll from './GetAll.jsx'
import getCookie from 'client/admin/resources/getCookie'
import BreadcrumbsPanel from 'client/admin/components/content/BreadcrumbsPanel/BreadcrumbsPanel.jsx'
import config from 'config/client'
import OrdersFilter from 'client/admin/components/content/OrdersFilter/OrdersFilter.jsx'
import LoadedContentView from 'client/admin/components/content/LoadedContentView/LoadedContentView.jsx'

class ByCityDateStatus extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            loadStatus: 'load'
        }
        this.statuses = [
            { value: 'all',        text: 'Все заявки' },
            { value: 'new',        text: 'Новые' },
            { value: 'working',    text: 'В работе' },
            { value: 'complite',   text: 'Выполненные' },
            { value: 'trash',      text: 'Удалены' },
        ]
    }

    componentWillMount(){
        this.userCityNameUrl = getCookie('userCityNameUrl')
    }

    componentDidMount(){
        const { dateString, status } = this.props.match.params
        const {
            orders,
            getOrdersByCityDateStatusAction,
            setOrdersOptionsAction
        } = this.props
        const dateToLink = dateString || this.todayToLinkString()

        setOrdersOptionsAction({
            cityNameUrl:          this.userCityNameUrl,
            dateToLink:           dateString,
            status: status,
        })

        getOrdersByCityDateStatusAction(this.userCityNameUrl, dateToLink, status)
        .then(() => {            
            if(this.props.orders.length){
                this.setState({ loadStatus: 'complete' })
            } else {
                this.setState({ loadStatus: 'empty' })
            }
        })
    }
    
    componentWillReceiveProps(nextProps){
        const { getOrdersByCityDateStatusAction, setOrdersOptionsAction } = this.props
        
        const oldDateString = this.props.match.params.dateString || this.todayToLinkString()
        const newDateString = nextProps.match.params.dateString  || this.todayToLinkString()
        const oldStatus     = this.props.match.params.status
        const newStatus     = nextProps.match.params.status

        //console.log(`old dateString ${ oldDateString }    |   new dateString ${ newDateString }`)
        if(newDateString != oldDateString || newStatus != oldStatus){
            setOrdersOptionsAction({
                cityNameUrl: this.userCityNameUrl,
                dateToLink:  newDateString,
                status:      newStatus
            })
            .then(() => {
                getOrdersByCityDateStatusAction(this.userCityNameUrl, newDateString, newStatus)
                .then(() => {
                    //console.log('заявки ', this.props.orders)
                    if(this.props.orders.length){
                        this.setState({ loadStatus: 'complete' })
                    } else {
                        this.setState({ loadStatus: 'empty' })
                    }
                })
            })
        }
    }

    todayToLinkString(){
        const date = new Date()
        const today = moment().add(0, 'day')
        return today.format(config.date.dateLinkFormat)
    }

    render(){
        const { orders } = this.props
        const { loadStatus } = this.state
        const dateString = this.props.match.params.dateString || this.todayToLinkString()
        const date = new Date(dateString)
        const dateToView = date.toLocaleDateString('ru-RU', config.date.dateViewOptions)
        const { status } = this.props.match.params

        const breadcrumbsLinks = [
            { url: '/orders', text:'Заявки' },
            { url: `/orders/date/${ dateString }`, text: dateToView },
            { 
                url: `/orders/date/${ dateString }/status/${ status }`, 
                text: this.statuses[_.findIndex(this.statuses, status => {
                    return status.value == status
                })] 
            },
        ]
        return (
            <div>
                <BreadcrumbsPanel
                    history={ this.props.history }
                    backButton={ false }
                    links={ breadcrumbsLinks }
                />
                <OrdersFilter
                    cityNameUrl={ this.userCityNameUrl }
                    dateString={ dateString }
                    status={ status }
                />
                <h1>{ dateToView }</h1>
                
                <LoadedContentView
                    loadStatus={ loadStatus }
                    message='Заявок нет.'
                >
                    <GetAll
                        orders={ orders }
                        cityNameUrl={ this.userCityNameUrl }
                        dateString={ dateString }
                    />
                </LoadedContentView>
            </div>
        )
    }
}

const mapStateToProps = state => ({
    orders: getOrdersSelector(state)
})

const mapDispatchToProps = {
    getOrdersByCityDateStatusAction,
    setOrdersOptionsAction
}

export default connect(mapStateToProps, mapDispatchToProps)(ByCityDateStatus)
