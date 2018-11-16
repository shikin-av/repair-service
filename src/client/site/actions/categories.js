import * as types from 'client/site/actions/actionTypes'
import * as api from 'client/site/api'

const defaultCallback = () => null

export const getCategories = () => async dispatch => {
    dispatch({ type: types.GET_CATEGORIES_START })
    try {
        const categories = await api.getCategories()
        dispatch({
            type: types.GET_CATEGORIES_SUCCESS,
            payload: categories || []
        })
    } catch(err) {
        dispatch({
            type: types.GET_CATEGORIES_FAIL,
            payload: err,
            error: true
        })
    }
}

export const getCurrentCategory = (nameUrl, callback=defaultCallback) => async dispatch => {
    dispatch({ type: types.GET_CURRENT_CATEGORY_START })
    try {
        const category = await api.getCurrentCategory(nameUrl)
        dispatch({
            type: types.GET_CURRENT_CATEGORY_SUCCESS,
            payload: category
        })
        if(category.error){
            callback({
                type:    'empty',
            })
        } else {
            callback({
                type:    'complete',
            })
        }        
    } catch(err) {
        dispatch({
            type: types.GET_CURRENT_CATEGORY_FAIL,
            payload: err,
            error: true
        })
        callback({
            type:    'empty',
        })
    }
}