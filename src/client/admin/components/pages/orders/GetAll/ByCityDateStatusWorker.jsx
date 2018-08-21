import React from 'react'
import { connect } from 'react-redux'
import moment from 'moment'
import _ from 'lodash'

import {
    getOrdersByCityDateStatusWorker as getOrdersByCityDateStatusWorkerAction
 } from 'client/admin/actions/orders'
 import {
     getOrders as getOrdersSelector
} from 'client/admin/selectors/orders'
import {
    setOrdersOptions as setOrdersOptionsAction
} from 'client/admin/actions/ordersOptions'
import {
    getUser as getUserApi
} from 'client/admin/api/users'

import GetAll from './GetAll.jsx'
import getCookie from 'client/admin/resources/getCookie'
import BreadcrumbsPanel from 'client/admin/components/content/BreadcrumbsPanel/BreadcrumbsPanel.jsx'
import config from 'config/client'
import OrdersFilter from 'client/admin/components/content/OrdersFilter/OrdersFilter.jsx'
import LoadedContentView from 'client/admin/components/content/LoadedContentView/LoadedContentView.jsx'

class ByCityDateStatusWorker extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            loadStatus: 'load',
            breadcrumbsLinks: [{ url: '/orders', text:'Заявки' }],
            dateToView: null
        }
        this.statuses = [
            { value: 'all',        text: 'Все заявки' },
            { value: 'new',        text: 'Новые' },
            { value: 'working',    text: 'В работе' },
            { value: 'complete',   text: 'Выполненные' },
            { value: 'trash',      text: 'Удалены' },
        ]
    }

    makeBreadcrumbs(dateToLink, dateToView, status, statusText, workerLogin, workerFio){
        const breadcrumbsLinks = [{ url: '/orders', text:'Заявки' }]
        if(dateToLink && dateToView){
            breadcrumbsLinks.push({ 
                url: `/orders/date/${ dateToLink }`, 
                text: dateToView 
            })
            if(status && statusText){
                breadcrumbsLinks.push({ 
                    url: `/orders/date/${ dateToLink }/status/${ status }`, 
                    text: statusText
                })
                if(workerLogin && workerFio){
                    breadcrumbsLinks.push({
                        url: `/orders/date/${ dateToLink }/status/${ status }/worker/${ workerLogin }`, 
                        text: workerFio
                    })
                } 
            }
        }
        return breadcrumbsLinks
    }

    componentWillMount(){
        this.userCityNameUrl = getCookie('userCityNameUrl')
    }

    componentDidMount(){
        const { dateString, status, workerLogin } = this.props.match.params
        const {
            orders,
            getOrdersByCityDateStatusWorkerAction,
            setOrdersOptionsAction
        } = this.props
        
        const dateToLink = dateString || this.todayToLinkString()
        const date = new Date(dateToLink)
        const dateToView = date.toLocaleDateString('ru-RU', config.date.dateViewOptions)
        const statusObj = this.statuses[_.findIndex(this.statuses, item => {
            return item.value == status
        })]

        setOrdersOptionsAction({
            cityNameUrl: this.userCityNameUrl,
            dateToLink:  dateToLink,
            status:      status,
            workerLogin: workerLogin
        })
        
        getUserApi(workerLogin)
        .then(user => {
            if(user && !user.error){
                getOrdersByCityDateStatusWorkerAction(this.userCityNameUrl, dateToLink, status, workerLogin)
                .then(() => {            
                    if(this.props.orders.length){
                        this.setState({ 
                            loadStatus: 'complete',
                            dateToView: dateToView,
                            breadcrumbsLinks: this.makeBreadcrumbs(
                                dateToLink, 
                                dateToView, 
                                status, 
                                statusObj.text,
                                workerLogin,
                                user.fio
                            )
                        })
                    } else {
                        this.setState({ 
                            loadStatus: 'empty',
                            dateToView: dateToView,
                            breadcrumbsLinks: this.makeBreadcrumbs(
                                dateToLink, 
                                dateToView, 
                                status, 
                                statusObj.text,
                                workerLogin,
                                user.fio
                            )
                        })
                    }
                })
            } else {
                this.setState({ 
                    loadStatus: 'empty',
                    dateToView: dateToView,
                    breadcrumbsLinks: this.makeBreadcrumbs(
                        dateToLink, 
                        dateToView, 
                        status, 
                        statusObj.text
                    )
                })
            }   
        })        
    }
    
    componentWillReceiveProps(nextProps){
        const { getOrdersByCityDateStatusAction, setOrdersOptionsAction } = this.props
        
        const oldDateString  = this.props.match.params.dateString || this.todayToLinkString()
        const newDateString  = nextProps.match.params.dateString  || this.todayToLinkString()
        const oldStatus      = this.props.match.params.status
        const newStatus      = nextProps.match.params.status
        const oldWorkerLogin = this.props.match.params.workerLogin
        const newWorkerLogin = nextProps.match.params.workerLogin

        if( newDateString  != oldDateString || 
            newStatus      != oldStatus ||
            newWorkerLogin != oldWorkerLogin
        ){            
            window.location.reload()    //TODO bad solution
        }
    }

    todayToLinkString(){
        const date = new Date()
        const today = moment().add(0, 'day')
        return today.format(config.date.dateLinkFormat)
    }

    render(){
        const { orders } = this.props
        const { status, workerLogin } = this.props.match.params
        const { loadStatus, breadcrumbsLinks, dateToView } = this.state
        const dateString = this.props.match.params.dateString || this.todayToLinkString()
               
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
                    workerLogin={ workerLogin }
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
    getOrdersByCityDateStatusWorkerAction,
    setOrdersOptionsAction
}

export default connect(mapStateToProps, mapDispatchToProps)(ByCityDateStatusWorker)
