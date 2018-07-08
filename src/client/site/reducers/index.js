import { combineReducers } from 'redux'
import { routerReducer } from 'react-router-redux'

import cities from './cities'
import currentCity from './currentCity'

export default combineReducers({
    cities,
    currentCity,
    router: routerReducer
})
