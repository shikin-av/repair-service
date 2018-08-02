import * as types from './actionTypes'

export const setOrdersOptions = options => async dispatch => {
    dispatch({ 
        type:    types.SET_ORDERS_OPTIONS,
        payload: options
    })
}