import * as types from 'client/admin/actions/actionTypes'

const initialState = []

export default (state = initialState, { type, payload }) => {
    switch(type){
        case types.GET_CATEGORY_SUCCESS: return payload
        
        default: return state
    }
}