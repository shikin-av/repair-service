const apiPath = '/publicapi/'

export const getCities = async () => {
    return fetch(apiPath + 'cities', {
        method: 'GET'
    })
    .then(res => res.json())
}