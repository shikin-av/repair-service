import layouts from '../client/layouts'
import resources from './resources'
import getApi from './api'
import getPublicApi from './api/publicApi'

export default (app) => {
    const auth = resources.auth()
    const config = app.get('config')
    app.use('/admin/', auth.verifyAdmin)

    app.get('/', (req, res) => {
        res.send(layouts.base({
            title:  config.indexTitle,
            script: config.bundle.js.site,
            css:    config.bundle.css.site
        }))
    })

    app.get('/admin', (req, res) => {
        res.send(layouts.base({
            title: 'Административная панель',
            script: config.bundle.js.admin,
            css:    config.bundle.css.admin
        }))
    })

    app.get('/login', (req, res) => {
        res.send(layouts.base({
            title: 'Авторизация',
            script: config.bundle.js.login,
            css:    config.bundle.css.login
        }))
    })

    app.post('/login', async (req, res) => {
        if(req.body.login && req.body.password){
            const login = req.body.login
            const password = req.body.password
            const userResult = await auth.validateDB(login, password)
            if(userResult.isAuthenticated){
                const token = auth.getToken(
                    userResult.user,
                    config.jwt.secret,
                    config.jwt.expiresSec
                )
                res.cookie('auth_token', token)
                res.json({ redirectTo: '/admin#/' })
            }else{
                res.status(401).json({ message: 'Проверьте правильность Логина и Пароля' })
            }
        }
    })

    const api = getApi()
    app.use('/admin/api', api)

    const publicApi = getPublicApi()
    app.use('/publicapi', publicApi)
}