import { combineReducers } from 'redux'
import { routerReducer } from 'react-router-redux'

//import categories from './categories'
import orders from './orders'
import ordersOptions from './ordersOptions'

export default combineReducers({
    orders,
    ordersOptions,
    router: routerReducer
})
