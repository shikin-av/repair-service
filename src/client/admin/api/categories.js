const apiPath = '/admin/api'

export const getCategories = async () => {
    return fetch(`${ apiPath }/categories`, {
        method: 'GET',
        credentials: 'include',
    })
    .then(res => res.json())
}

export const getCategory = async category => {
    return fetch(`${ apiPath }/categories/${ category }`, {
        method: 'GET',
        credentials: 'include',
    })
    .then(res => res.json())
}

export const createCategory = async params => {
    return fetch(`${ apiPath }/categories`, {
        method: 'POST',
        credentials: 'include',
        body: JSON.stringify(params)
    })
    .then(res => res.json())
}