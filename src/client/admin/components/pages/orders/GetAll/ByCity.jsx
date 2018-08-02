import React from 'react'
import { connect } from 'react-redux'

import { 
    getOrdersByCity as getOrdersByCityAction
 } from 'client/admin/actions/orders'
 import { 
     getOrders as getOrdersSelector 
} from 'client/admin/selectors/orders'

import GetAll from './GetAll.jsx'
import getCookie from 'client/admin/resources/getCookie'

const Spin = require('antd/lib/spin')
require('antd/lib/spin/style/css')

class ByCity extends React.Component {
    constructor(props){
        super(props)
    }

    componentWillMount(){
        this.userCityNameUrl = getCookie('userCityNameUrl')
    }

    componentDidMount(){
        const { orders, getOrdersByCityAction } = this.props        
        if(!orders.length) {
            getOrdersByCityAction(this.userCityNameUrl)
            .then(() => {
                console.log('заявки ', this.props.orders)
            })
        }
    }

    render(){
        const { orders } = this.props
        if(orders.length){
            return (
                <GetAll
                    orders={ orders }
                    cityNameUrl={ this.userCityNameUrl }
                />
            )
        } else return ( <Spin/> )        
    }
}

const mapStateToProps = state => ({
    orders: getOrdersSelector(state)
})

const mapDispatchToProps = {
    getOrdersByCityAction
}

export default connect(mapStateToProps, mapDispatchToProps)(ByCity)