import { combineReducers } from 'redux'
import { routerReducer } from 'react-router-redux'

import cities from './cities'
import currentCity from './currentCity'
import currentCategory from './currentCategory'

export default combineReducers({
    cities,
    currentCity,
    currentCategory,
    router: routerReducer
})
