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

export const getOrdersByCityDateStatus = async (city, dateString, status) => {
    return fetch(`${ apiPath }/orders/city/${ city }/date/${ dateString }/status/${ status }`, {
        method: 'GET',
        credentials: 'include',
    })
    .then(res => res.json())
}

export const getOrdersByCityDateStatusWorker = async (city, dateString, status, workerLogin) => {
    return fetch(`${ apiPath }/orders/city/${ city }/date/${ dateString }/status/${ status }/worker/${ workerLogin }`, {
        method: 'GET',
        credentials: 'include',
    })
    .then(res => res.json())
}

export const getOrdersByCityId = async (city, id) => {
    return fetch(`${ apiPath }/orders/city/${ city }/serch-id/${ id }`, {
        method: 'GET',
        credentials: 'include',
    })
    .then(res => res.json())
}

export const getOrdersByCityDatePerMonth = async (city, dateString) => {
    return fetch(`${ apiPath }/orders/city/${ city }/date/${ dateString }/per-month`, {
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

export const editOrder = async (city, dateString, id, params) => {
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