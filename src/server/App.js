import express from 'express'
import mongoose from 'mongoose'
import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import http from 'http'
import socket from 'socket.io'

import errorHandlers from './errorHandlers'
import router from './router'
import socketsHandler from './resources/socketsHandler'

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

        this.setRoutes()
        this.setSockets()
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
        //this.app.use('/assets', express.static('./assets'))
        this.app.use(this.config.assetsPath, express.static(`.${ this.config.assetsPath }`))
        this.app.use('/dist', express.static('./dist'))
    }

    setRoutes(){
        router(this.app)
    }

    setSockets(){
        this.server = http.Server(this.app)
        this.io = socket(this.server)
        socketsHandler(this.io)
    }

    async run(){
        try {
            this.db = await this.getConnectionDB()
        } catch(err){
            console.log(err)
        }

        this.db.on('error', (err) => {
            console.log('db connection error:', err.message)
        })
        this.db.on('open', () => {
            console.log('Connected to DB')
        })

        return this.server.listen(this.config.port, () => {
            console.log(`App run on ${ this.config.port } port`)
        })
    }
}
