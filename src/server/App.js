import express from 'express'
import mongoose from 'mongoose'
import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
//import multiparty from 'multiparty'

import layouts from '../client/layouts'
import getApi from './api'
import errorHandlers from './errorHandlers'
import resources from './resources'

export default class App {
    constructor(params = {}){
        Object.assign(this, params)
        this.init()
    }

    init(){
        this.app = express()

        this.app.use([
            bodyParser.urlencoded({ extended: true }),
            cookieParser(),
            bodyParser.json()
        ])

        this.app.set('config', this.config)

        this.auth = resources.auth()
        this.app.use('/admin/', this.auth.verifyAdmin)

        this.setRoutes()
        this.setStatic()

        this.app.use((err, req, res, next) => {
            errorHandlers.errors(err, req, res, next)
        })
        this.app.use((req, res, next) => {
            errorHandlers.error404(req, res, next)
        })
    }

    async getConnectionDB(){
        const urlDB = `mongodb://${ this.config.db.user }:${ this.config.db.password }${ this.config.db.url }`
        await mongoose.connect(urlDB)
        return await mongoose.connection

    }

    setStatic(){
        this.app.use('/assets', express.static('./assets'))
        this.app.use('/dist', express.static('./dist'))
    }

    setRoutes(){
        this.app.get('/', (req, res) => {
            res.send(layouts.base({
                title: this.config.indexTitle,
                script: this.config.bundle.index
            }))
        })

        this.app.get('/login', (req, res) => {
            res.send(layouts.base({
                title: 'Авторизация',
                script: this.config.bundle.login
            }))
        })

        this.app.post('/login', async (req, res) => {
            if(req.body.login && req.body.password){
                const login = req.body.login
                const password = req.body.password
                const userResult = await this.auth.validateDB(login, password)
                if(userResult.isAuthenticated){
                    const token = this.auth.getToken(
                        userResult.user,
                        this.config.jwt.secret,
                        this.config.jwt.expiresSec
                    )
                    res.cookie('auth_token', token)
                    res.json({ redirectTo: '/admin#/' })
                }else{
                    res.status(401).json({ message: 'Проверьте правильность Логина и Пароля' })
                }
            }
        })

        this.app.get('/admin', (req, res) => {
            res.send(layouts.base({
                title: 'Административная панель',
                script: this.config.bundle.admin
            }))
        })

        const api = getApi()
        this.app.use('/admin/api', api)
    }

    async run(){
        try {
            this.db = await this.getConnectionDB()
        } catch(err){
            console.log(err)
        }

        this.db.on('error', (err) => {
            console.log('connection error:', err.message)
        })
        this.db.on('open', () => {
            console.log('Connected to DB')
        })

        return this.app.listen(this.config.port, () => {
            console.log(`App run on ${ this.config.port } port`)
        })
    }
}
