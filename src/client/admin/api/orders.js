import config from 'config/client'
const apiPath = config.apiPath

export const getOrdersByCity = async city => {
    return fetch(`${ apiPath }/orders/city/${ city }`, {
        method: 'GET',
        credentials: 'include',
    })
    .then(res => res.json())
}

export const getOrdersByCityDate = async (city, dateString) => {
    return fetch(`${ apiPath }/orders/city/${ city }/date/${ dateString }`, {
        method: 'GET',
        credentials: 'include',
    })
    .then(res => res.json())
}

export const getOrder = async (city, dateString, id) => {
    return fetch(`${ apiPath }/orders/city/${ city }/date/${ dateString }/id/${ id }`, {
        method: 'GET',
        credentials: 'include',
    })
    .then(res => res.json())
}

export const editOrder = async (city, dateString, id, params) => {  //TODO
    return fetch(`${ apiPath }/orders/city/${ city }/date/${ dateString }/id/${ id }`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify(params)
    })
    .then(res => res.json())
}