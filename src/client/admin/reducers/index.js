import { combineReducers } from 'redux'
import { routerReducer } from 'react-router-redux'

import categories from './categories'
import category from './category'

export default combineReducers({
    categories,
    category,
    router: routerReducer
})
