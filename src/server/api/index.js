import { Router } from 'express'
import getCategoriesApi from './categories'
import getUsersApi from './users'
import getCitiesApi from './cities'
import getGalleryApi from './gallery'

export default () => {
    const api = Router()

    api.all('/', (req, res) => ({}))
    api.use('/categories', getCategoriesApi())
    api.use('/users', getUsersApi())
    api.use('/cities', getCitiesApi())
    api.use('/gallery', getGalleryApi())

    return api
}
