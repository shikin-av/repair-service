import express from 'express'
import mongoose from 'mongoose'
import bodyParser from 'body-parser'
import Promise from 'bluebird'

import layouts from '../layouts'
import getApi from './api'
import errorHandlers from './errorHandlers'

export default class App {
    constructor(params = {}){
        Object.assign(this, params)
        this.init()
    }

    init(){
        this.app = express()

        this.app.use([
            bodyParser.urlencoded({ extended: true }),
            bodyParser.json()
        ])

        this.setStatic()
        this.setRoutes()
    }

    async getConnectionDB(){
        const urlDB = `mongodb://${ this.config.db.user }:${ this.config.db.password }${ this.config.db.url }`
        //return await mongoose.connect(urlDB)
        /*return {
            connect: () => {
                new Promise(resolve => {
                    let db = mongoose.connect(urlDB)
                    console.log('db ', db)
                    return resolve()
                })
            }
        }*/
        /*return {
            connect: async function(){
                return await mongoose.connect(urlDB)
            }
        }*/
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

        this.app.get('/admin', (req, res) => {
            res.send(layouts.base({
                title: 'Административная панель',
                script: this.config.bundle.admin
            }))
        })

        const api = getApi()
        this.app.use('/api', api)

        this.app.use((err, req, res, next) => {
            errorHandlers.errors(err, req, res, next)
        })

        this.app.use((req, res, next) => {
            errorHandlers.error404(req, res, next)
        })
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
