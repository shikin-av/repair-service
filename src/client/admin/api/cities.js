import config from 'config/client'
const apiPath = config.apiPath

export const getCities = async () => {
    return fetch(`${ apiPath }/cities`, {
        method: 'GET',
        credentials: 'include',
    })
    .then(res => res.json())
}

export const getCity = async nameUrl => {
    return fetch(`${ apiPath }/cities/${ nameUrl }`, {
        method: 'GET',
        credentials: 'include',
    })
    .then(res => res.json())
}

export const createCity = async params => {
    return fetch(`${ apiPath }/cities`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify(params)
    })
    .then(res => res.json())
}

export const editCity = async (nameUrl, params) => {
    return fetch(`${ apiPath }/cities/${ nameUrl }`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify(params)
    })
    .then(res => res.json())
}

export const deleteCity = async (nameUrl) => {
    return fetch(`${ apiPath }/cities/${ nameUrl }`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        },
        credentials: 'include'
    })
    .then(res => res.json())
}