import config from 'config/client'
const apiPath = config.apiPath

export const getCategories = async () => {
    return fetch(`${ apiPath }/categories`, {
        method: 'GET',
        credentials: 'include',
    })
    .then(res => res.json())
}

export const getCategory = async nameUrl => {
    return fetch(`${ apiPath }/categories/${ nameUrl }`, {
        method: 'GET',
        credentials: 'include',
    })
    .then(res => res.json())
}

export const createCategory = async params => {
    return fetch(`${ apiPath }/categories`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify(params)
    })
    .then(res => res.json())
}

export const editCategory = async (nameUrl, params) => {
    return fetch(`${ apiPath }/categories/${ nameUrl }`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify(params)
    })
    .then(res => res.json())
}

export const deleteCategory = async (nameUrl) => {
    return fetch(`${ apiPath }/categories/${ nameUrl }`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        },
        credentials: 'include'
    })
    .then(res => res.json())
}