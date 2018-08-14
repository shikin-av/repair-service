import React from 'react'
import { connect } from 'react-redux'
import moment from 'moment'
import _ from 'lodash'

import {
    getOrdersByCityId as getOrdersByCityIdAction
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

class ByCityId extends React.Component {
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
        const { id } = this.props.match.params
        const {
            orders,
            getOrdersByCityIdAction,
            setOrdersOptionsAction
        } = this.props        

        setOrdersOptionsAction({
            id: id
        })

        getOrdersByCityIdAction(this.userCityNameUrl, id)
        .then(() => {            
            if(this.props.orders.length){
                this.setState({ loadStatus: 'complete' })
            } else {
                this.setState({ loadStatus: 'empty' })
            }
        })
    }
    
    componentWillReceiveProps(nextProps){
        const { getOrdersByCityIdAction, setOrdersOptionsAction } = this.props
                
        const oldId     = this.props.match.params.id
        const newId     = nextProps.match.params.id
        
        if(newId != oldId){
            setOrdersOptionsAction({
                id: newId
            })
            .then(() => {
                getOrdersByCityIdAction(this.userCityNameUrl, newId)
                .then(() => {
                    console.log('заявки ', this.props.orders)
                    if(this.props.orders.length){
                        this.setState({ loadStatus: 'complete' })
                    } else {
                        this.setState({ loadStatus: 'empty' })
                    }
                })
            })
        }
    }

    render(){
        const { orders } = this.props
        const { loadStatus } = this.state
                
        const { id } = this.props.match.params

        const breadcrumbsLinks = [
            { url: '/orders', text:'Заявки' },
            { url: `/orders/serch-id/${ id }`, text: `№${ id }` },            
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
                    dateString={ null }
                    status={ status }
                />
                <h1>Поиск заявки №{ id }</h1>
                
                <LoadedContentView
                    loadStatus={ loadStatus }
                    message={ `№${ id } заявок нет.` }
                >
                    <GetAll
                        orders={ orders }
                        cityNameUrl={ this.userCityNameUrl }
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
    getOrdersByCityIdAction,
    setOrdersOptionsAction
}

export default connect(mapStateToProps, mapDispatchToProps)(ByCityId)
