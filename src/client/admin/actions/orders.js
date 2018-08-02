import * as types from './actionTypes'
import * as api from 'client/admin/api/orders'

export const getOrdersByCity = city => async dispatch => {
    dispatch({ type: types.GET_ORDERS_BY_CITY_START })
    try {
        const orders = await api.getOrdersByCity(city)
        dispatch({
            type:    types.GET_ORDERS_BY_CITY_SUCCESS,
            payload: orders || []
        })
    } catch(err) {
        dispatch({
            type:    types.GET_ORDERS_BY_CITY_FAIL,
            payload: err,
            error:   true
        })
    }
}

export const getOrdersByCityDate = (city, dateString) => async dispatch => {
    dispatch({ type: types.GET_ORDERS_BY_CITY_DATE_START })
    try {
        const orders = await api.getOrdersByCityDate(city, dateString)
        dispatch({
            type:    types.GET_ORDERS_BY_CITY_DATE_SUCCESS,
            payload: orders || []
        })
    } catch(err) {
        dispatch({
            type:    types.GET_ORDERS_BY_CITY_DATE_FAIL,
            payload: err,
            error:   true
        })
    }
}

export const appendOrder = order => async dispatch => {
    dispatch({ 
        type: types.APPEND_ORDER,
        payload: order
    })
}