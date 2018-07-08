import * as types from 'client/site/actions/actionTypes'

const initialState = null

export default (state = initialState, { type, payload }) => {
    switch(type){
        case types.SET_CURRENT_CITY: return payload

        default: return state
    }
}