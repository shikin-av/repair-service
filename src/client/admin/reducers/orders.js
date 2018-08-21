import * as types from 'client/admin/actions/actionTypes'

const initialState = []

export default (state=initialState, { type, payload }) => {
    switch(type){
        case types.GET_ORDERS_BY_CITY_SUCCESS: return payload

        case types.GET_ORDERS_BY_CITY_DATE_SUCCESS: return payload

        case types.GET_ORDERS_BY_CITY_DATE_STATUS_SUCCESS: return payload

        case types.GET_ORDERS_BY_CITY_DATE_STATUS_WORKER_SUCCESS: return payload

        case types.GET_ORDERS_BY_CITY_ID_SUCCESS: return payload

        case types.APPEND_ORDER:
            return [payload, ...state]
        
        default: return state
    }
}