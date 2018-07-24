import { Router } from 'express'
import fileUpload from 'express-fileupload'
import fs from 'fs'

import config from '../../config/server'
import checkFileExtension from './checkFileExtension'

export default () => {
    const gallery = Router()

    gallery.use(fileUpload({
        limits: { fileSize: 2 * 1024 * 1024 },
      }))

    gallery.post('/upload', async (req, res) => {
        if (!req.files){
            return res.status(400).send('Файл не загружен')
        } else {
            const image = req.files.image
            image.mv(`${ config.assetsDir }/imgs/${ image.name }`, err => {
                if(err) return res.status(500).send(err)
                res.send(`Файл ${ image.name } успешно загружен`)
            })
        }
    })

    gallery.get('/', async (req, res) => {
        const path = `${ config.assetsDir }/imgs`
        fs.readdir(path, function(err, items) {
            if(!err){
                const images = []
                for(let item of items) {
                    if(fs.statSync(`${ path }/${ item }`).isFile()){
                        const extensions = ['jpg', 'jpeg', 'png']
                        const isImage = checkFileExtension(item, ...extensions)
                        if(isImage) images.push(item)
                    }
                }
                res.send(images)
            } else {
                console.log(`ERROR ${err.stack}`)
                return res.status(500).send(err)
            }
        })
    })
    
    return gallery    
}