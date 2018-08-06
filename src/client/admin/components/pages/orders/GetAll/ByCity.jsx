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

class ByCity extends React.Component {
    constructor(props){
        super(props)
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
        })
    }

    render(){
        const { orders } = this.props
        return (
            <GetAll
                orders={ orders }
                cityNameUrl={ this.userCityNameUrl }
            />
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
