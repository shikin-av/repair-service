import * as types from './actionTypes'
import * as api from 'client/admin/api/categories'

/*export const getCategories = () => async dispatch => {
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
}*/

/*export const getCategory = nameUrl => async dispatch => {
    dispatch({ type: types.GET_CATEGORY_START })
    try {
        const category = await api.getCategory(nameUrl)
        dispatch({
            type: types.GET_CATEGORY_SUCCESS,
            payload: category
        })
    } catch(err) {
        dispatch({
            type: types.GET_CATEGORY_FAIL,
            payload: err,
            error: true
        })
    }
}*/

/*export const createCategory = params => async dispatch => {
    dispatch({ type: types.CREATE_CATEGORY_START })
    try {
        const category = await api.createCategory(params)
        dispatch({
            type: types.CREATE_CATEGORY_SUCCESS,
            payload: category
        })
    } catch(err) {
        dispatch({
            type: types.CREATE_CATEGORY_FAIL,
            payload: err,
            error: true
        })
    }
}*/