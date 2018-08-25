import { combineReducers } from 'redux'
import { routerReducer } from 'react-router-redux'

import orders from './orders'
import ordersOptions from './ordersOptions'

export default combineReducers({
    orders,
    ordersOptions,
    router: routerReducer
})
