import config from 'config/client'
const apiPath = config.apiPath

export const getUsers = async () => {
    return fetch(`${ apiPath }/users`, {
        method: 'GET',
        credentials: 'include',
    })
    .then(res => res.json())
}

export const getUsersByCityCategoryDays = async (cityNameUrl, categoryNameUrl, dayCyrilic) => {
    const encodedDay = encodeURI(dayCyrilic)
    return fetch(`${ apiPath }/users/city/${ cityNameUrl }/category/${ categoryNameUrl }/day/${ encodedDay }`, {
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