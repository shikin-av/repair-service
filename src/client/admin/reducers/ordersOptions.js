import * as types from 'client/admin/actions/actionTypes'

const initialState = {}

export default (state=initialState, { type, payload }) => {
    switch(type){
        case types.SET_ORDERS_OPTIONS: return payload

        default: return state
    }
}