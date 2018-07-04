import * as types from './actionTypes'
import * as api from '../api'

export const getCities = () => async dispatch => {
    dispatch({ type: types.GET_CITIES_START })
    try {
        const cities = await api.getCities()
        dispatch({
            type: types.GET_CITIES_SUCCESS,
            payload: cities || []
        })
    } catch(err) {
        dispatch({
            type: types.GET_CITIES_FAIL,
            payload: err,
            error: true
        })
    }
}
