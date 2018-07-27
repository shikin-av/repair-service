const apiPath = '/admin/api'

export const getUsers = async () => {
    return fetch(`${ apiPath }/users`, {
        method: 'GET',
        credentials: 'include',
    })
    .then(res => res.json())
}

export const getUser = async nameUrl => {
    return fetch(`${ apiPath }/users/${ nameUrl }`, {
        method: 'GET',
        credentials: 'include',
    })
    .then(res => res.json())
}

export const createUser = async params => {
    return fetch(`${ apiPath }/users`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify(params)
    })
    .then(res => res.json())
}

export const editUser = async (nameUrl, params) => {
    return fetch(`${ apiPath }/users/${ nameUrl }`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify(params)
    })
    .then(res => res.json())
}

export const deleteUser = async (nameUrl) => {
    return fetch(`${ apiPath }/users/${ nameUrl }`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        },
        credentials: 'include'
    })
    .then(res => res.json())
}