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

export const getOrdersByCityDateStatus = (city, dateString, status) => async dispatch => {
    dispatch({ type: types.GET_ORDERS_BY_CITY_DATE_STATUS_START })
    try {
        const orders = await api.getOrdersByCityDateStatus(city, dateString, status)
        dispatch({
            type:    types.GET_ORDERS_BY_CITY_DATE_STATUS_SUCCESS,
            payload: orders || []
        })
    } catch(err) {
        dispatch({
            type:    types.GET_ORDERS_BY_CITY_DATE_STATUS_FAIL,
            payload: err,
            error:   true
        })
    }
}

export const getOrdersByCityDateStatusWorker = (city, dateString, status, workerLogin) => async dispatch => {
    dispatch({ type: types.GET_ORDERS_BY_CITY_DATE_STATUS_WORKER_START })
    try {
        const orders = await api.getOrdersByCityDateStatusWorker(city, dateString, status, workerLogin)
        dispatch({
            type:    types.GET_ORDERS_BY_CITY_DATE_STATUS_WORKER_SUCCESS,
            payload: orders || []
        })
    } catch(err) {
        dispatch({
            type:    types.GET_ORDERS_BY_CITY_DATE_STATUS_WORKER_FAIL,
            payload: err,
            error:   true
        })
    }
}

export const getOrdersByCityId = (city, id) => async dispatch => {
    dispatch({ type: types.GET_ORDERS_BY_CITY_ID_START })
    try {
        const orders = await api.getOrdersByCityId(city, id)
        dispatch({
            type:    types.GET_ORDERS_BY_CITY_ID_SUCCESS,
            payload: orders || []
        })
    } catch(err) {
        dispatch({
            type:    types.GET_ORDERS_BY_CITY_ID_FAIL,
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