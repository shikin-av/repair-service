import React from 'react'
import { connect } from 'react-redux'

import {
    getOrdersByCity as getOrdersByCityAction
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
import OrdersFilter from 'client/admin/components/content/OrdersFilter/OrdersFilter.jsx'
import LoadedContentView from 'client/admin/components/content/LoadedContentView/LoadedContentView.jsx'

class ByCity extends React.Component {
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
            getOrdersByCityAction,
            setOrdersOptionsAction
        } = this.props

        setOrdersOptionsAction({
            cityNameUrl: this.userCityNameUrl
        })

        getOrdersByCityAction(this.userCityNameUrl)
        .then(() => {
            //console.log('заявки ', this.props.orders)
            if(this.props.orders.length){
                this.setState({ loadStatus: 'complete' })
            } else {
                this.setState({ loadStatus: 'empty' })
            }
        })
    }

    render(){
        const { orders } = this.props
        const { loadStatus } = this.state
        return (
            <div>
                <BreadcrumbsPanel
                    history={ this.props.history }
                    backButton={ false }
                    links={[
                        { url: '/orders', text:'Заявки' }
                    ]}
                />
                <OrdersFilter
                    cityNameUrl={ this.userCityNameUrl }
                    dateString={ null }
                />
                <h1>Все заявки</h1>

                <LoadedContentView
                    loadStatus={ loadStatus }
                    message={ 'Заявок нет.' }
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
    getOrdersByCityAction,
    setOrdersOptionsAction
}

export default connect(mapStateToProps, mapDispatchToProps)(ByCity)
