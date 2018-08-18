import { Router } from 'express'
import getCategoriesApi from './categories'
import getUsersApi from './users'
import getCitiesApi from './cities'
import getGalleryApi from './gallery'
import getOrdersApi from './orders'
import getTextsApi from './texts'

export default () => {
    const api = Router()

    api.all('/', (req, res) => ({}))
    api.use('/categories', getCategoriesApi())
    api.use('/users', getUsersApi())
    api.use('/cities', getCitiesApi())
    api.use('/gallery', getGalleryApi())
    api.use('/orders', getOrdersApi())
    api.use('/texts', getTextsApi())

    return api
}
