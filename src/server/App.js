import express from 'express'
import mongoose from 'mongoose'

import layouts from '../layouts'
import getApi from './api'

export default class App {
    constructor(params = {}){
        Object.assign(this, params)
        this.init()
    }

    init(){
        this.app = express()
        this.setStatic()
        this.setRoutes()
    }

    async connectDB(){
        const urlDB = `mongodb://${ this.config.db.user }:${ this.config.db.password }${ this.config.db.url }`
        return await mongoose.connect(urlDB)
    }

    setStatic(){
        this.app.use('/assets', express.static('./assets'))
        this.app.use('/dist', express.static('./dist'))
    }

    setRoutes(){
        this.app.get('/', (req, res) => {
            res.send(layouts.base({
                title: 'Ремонт бытовой техники',
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

        this.app.use(function(req, res) {
            res.status(404).end('error');
        })
    }

    run(){
        try {
            this.connectDB()
        } catch(err){
            console.log(err)
        }
        return this.app.listen(this.config.port, () => {
            console.log(`App run on ${ this.config.port } port`)
        })
    }
}
