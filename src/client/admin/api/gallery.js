import config from 'config/client'
const apiPath = config.apiPath

export const uploadUrl = 'admin/api/gallery/upload'

export const getImages = async () => {
    return fetch(`${ apiPath }/gallery`,{
        method: 'GET',
        credentials: 'include',
    })
    .then(res => res.json())
}

export const deleteImage = async imageName => {
    return fetch(`${ apiPath }/gallery/${ imageName }`,{
        method: 'DELETE',
        credentials: 'include',
    })
    .then(res => res.json())
}