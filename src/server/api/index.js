import { Router } from 'express'
import getCategoriesApi from './categories'
import getUsersApi from './users'
import getCitiesApi from './cities'
import getGalleryApi from './gallery'
import getOrdersApi from './orders'

export default () => {
    const api = Router()

    api.all('/', (req, res) => ({}))
    api.use('/categories', getCategoriesApi())
    api.use('/users', getUsersApi())
    api.use('/cities', getCitiesApi())
    api.use('/gallery', getGalleryApi())
    api.use('/orders', getOrdersApi())

    return api
}
