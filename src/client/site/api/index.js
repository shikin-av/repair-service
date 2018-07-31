const apiPath = '/publicapi'

export const getCities = async () => {
    return fetch(`${ apiPath }/cities`, {
        method: 'GET'
    })
    .then(res => res.json())
}

export const getCategories = async () => {
    return fetch(`${ apiPath }/categories`, {
        method: 'GET'
    })
    .then(res => res.json())
}

export const getCurrentCategory = async nameUrl => {
    return fetch(`${ apiPath }/categories/${ nameUrl }`, {
        method: 'GET'
    })
    .then(res => res.json())
}

export const createOrder = async params => {
    return fetch(`${ apiPath }/orders`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify(params)
    })
    .then(res => res.json())
}