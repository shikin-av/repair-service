import { combineReducers } from 'redux'
import { routerReducer } from 'react-router-redux'

//import categories from './categories'
import orders from './orders'

export default combineReducers({
    orders,
    router: routerReducer
})
