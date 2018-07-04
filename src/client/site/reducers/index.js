import { combineReducers } from 'redux'
import { routerReducer } from 'react-router-redux'

import cities from './cities'

export default combineReducers({
    cities,
    router: routerReducer
})
