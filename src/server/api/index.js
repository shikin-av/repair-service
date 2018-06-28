import { Router } from 'express'
import getCategoriesApi from './categories'

export default () => {
    const api = Router()
    const categoriesApi = getCategoriesApi()

    api.all('/', (req, res) => ({}))
    api.use('/categories', categoriesApi)

    return api
}
