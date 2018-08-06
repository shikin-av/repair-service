import React from 'react'
import { connect } from 'react-redux'

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

class ByCityDate extends React.Component {
    constructor(props){
        super(props)
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
        const { dateString } = this.props.match.params

        setOrdersOptionsAction({
            cityNameUrl: this.userCityNameUrl,
            dateString:  dateString
        })

        getOrdersByCityDateAction(this.userCityNameUrl, dateString)
        .then(() => {
            //console.log('заявки ', this.props.orders)
        })
    }

    componentWillReceiveProps(nextProps){
        const { getOrdersByCityDateAction, setOrdersOptionsAction } = this.props
        const oldDateString = this.props.match.params.dateString
        const newDateString = nextProps.match.params.dateString

        //console.log(`old dateString ${ oldDateString }    |   new dateString ${ newDateString }`)
        if(newDateString != oldDateString){
            setOrdersOptionsAction({
                cityNameUrl: this.userCityNameUrl,
                dateString:  newDateString
            })
            .then(() => {
                getOrdersByCityDateAction(this.userCityNameUrl, newDateString)
                .then(() => {
                    //console.log('заявки ', this.props.orders)
                })
            })
        }
    }

    render(){
        const { orders } = this.props
        const { dateString } = this.props.match.params
        return (
            <GetAll
                orders={ orders }
                cityNameUrl={ this.userCityNameUrl }
                dateString={ dateString }
            />
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
