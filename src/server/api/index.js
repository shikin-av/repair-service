import { Router } from 'express'
import getCategoriesApi from './categories'
import getUsersApi from './users'

export default () => {
    const api = Router()
    const categoriesApi = getCategoriesApi()
    const usersApi = getUsersApi()

    api.all('/', (req, res) => ({}))
    api.use('/categories', categoriesApi)
    api.use('/users', usersApi)

    return api
}
