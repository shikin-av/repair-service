import { Router } from 'express'
import getCategoriesApi from './categories'
import getUsersApi from './users'
import getCitiesApi from './cities'

export default () => {
    const api = Router()
    const categoriesApi = getCategoriesApi()
    const usersApi = getUsersApi()
    const citiesApi = getCitiesApi()

    api.all('/', (req, res) => ({}))
    api.use('/categories', categoriesApi)
    api.use('/users', usersApi)
    api.use('/cities', citiesApi)

    return api
}
