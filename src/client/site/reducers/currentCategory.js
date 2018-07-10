import * as types from 'client/site/actions/actionTypes'

const initialState = []

export default (state = initialState, { type, payload }) => {
    switch(type){
        case types.GET_CURRENT_CATEGORY_SUCCESS: return payload

        default: return state
    }
}