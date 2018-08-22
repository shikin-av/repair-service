import React from 'react'
import { connect } from 'react-redux'
import moment from 'moment'

import {
    getOrdersByCityDate as getOrdersByCityDateAction
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

class ByCityDate extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            loadStatus: 'load'
        }
    }

    componentWillMount(){
        this.userCityNameUrl = getCookie('userCityNameUrl')
    }

    componentDidMount(){
        const {
            orders,
            getOrdersByCityDateAction,
            setOrdersOptionsAction
        } = this.props
        const dateString = this.props.match.params.dateString || this.todayToLinkString()

        setOrdersOptionsAction({
            cityNameUrl: this.userCityNameUrl,
            dateToLink:  dateString
        })

        getOrdersByCityDateAction(this.userCityNameUrl, dateString)
        .then(() => {
            //console.log('заявки ', this.props.orders)
            if(this.props.orders.length){
                this.setState({ loadStatus: 'complete' })
            } else {
                this.setState({ loadStatus: 'empty' })
            }
        })
    }

    componentWillReceiveProps(nextProps){
        const { getOrdersByCityDateAction, setOrdersOptionsAction } = this.props
        const oldDateString = this.props.match.params.dateString || this.todayToLinkString()
        const newDateString = nextProps.match.params.dateString  || this.todayToLinkString()

        //console.log(`old dateString ${ oldDateString }    |   new dateString ${ newDateString }`)
        if(newDateString != oldDateString){
            setOrdersOptionsAction({
                cityNameUrl: this.userCityNameUrl,
                dateToLink:  newDateString
            })
            .then(() => {
                getOrdersByCityDateAction(this.userCityNameUrl, newDateString)
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
        const breadcrumbsLinks = [
            { url: '/orders', text:'Заявки' },
            { url: `/orders/date/${ dateString }`, text: dateToView },
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
                />
                <h1>{ dateToView }</h1>
                
                <LoadedContentView
                    loadStatus={ loadStatus }
                    message={ `${ dateToView } заявок нет.` }
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
    getOrdersByCityDateAction,
    setOrdersOptionsAction
}

export default connect(mapStateToProps, mapDispatchToProps)(ByCityDate)
