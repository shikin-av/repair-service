import config from 'config/client'
const apiPath = config.apiPath

export const getTexts = async () => {
    return fetch(`${ apiPath }/texts`, {
        method: 'GET',
        credentials: 'include',
    })
    .then(res => res.json())
}

export const getText = async nameUrl => {
    return fetch(`${ apiPath }/texts/${ nameUrl }`, {
        method: 'GET',
        credentials: 'include',
    })
    .then(res => res.json())
}

export const createText = async params => {
    return fetch(`${ apiPath }/texts`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify(params)
    })
    .then(res => res.json())
}

export const editText = async (nameUrl, params) => {
    return fetch(`${ apiPath }/texts/${ nameUrl }`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify(params)
    })
    .then(res => res.json())
}

export const deleteText = async (nameUrl) => {
    return fetch(`${ apiPath }/texts/${ nameUrl }`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        },
        credentials: 'include'
    })
    .then(res => res.json())
}