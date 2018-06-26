import { AsyncRouter } from 'express-async-router'

export default () => {
    const api = AsyncRouter()
    api.all('/', () => ({foo: true, bar: '1.0.1'}))
    api.all('/test', () => ({test: 123123}))
    return api
}
