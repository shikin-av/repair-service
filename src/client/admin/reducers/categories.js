import * as types from 'client/admin/actions/actionTypes'

const initialState = []

export default (state = initialState, { type, payload }) => {
    switch(type){
        case types.GET_CATEGORIES_SUCCESS: return payload
        
        case types.CREATE_CATEGORY_SUCCESS:
            return state.push(payload)

        default: return state
    }
}