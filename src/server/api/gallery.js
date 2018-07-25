import { Router } from 'express'
import fileUpload from 'express-fileupload'
import fs from 'fs'

import config from '../../config/server'
import checkFileExtension from '../resources/checkFileExtension'

export default () => {
    const gallery = Router()
    const imageDir = `${ config.assetsDir }/imgs`

    gallery.use(fileUpload({
        limits: { fileSize: 2 * 1024 * 1024 },
      }))

    gallery.post('/upload', async (req, res) => {
        if (!req.files){
            return res.status(400).send('Файл не загружен')
        } else {
            const image = req.files.image
            image.mv(`${ imageDir }/${ image.name }`, err => {
                if(err) return res.status(500).send(err)
                res.send(`Файл ${ image.name } успешно загружен`)
            })
        }
    })

    gallery.get('/', async (req, res) => {
        fs.readdir(imageDir, (err, items) => {
            if(!err){
                const images = []
                for(let item of items) {
                    if(fs.statSync(`${ imageDir }/${ item }`).isFile()){
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

    gallery.delete('/:fileName', async (req, res) => {
        const fileName = req.params.fileName
        /*fs.readdir(imageDir, (err, items) => {
            if(!err){
                const filePath = `${ imageDir }/${ fileName }`
                if(fs.statSync(filePath).isFile()){
                    fs.unlinkSync(filePath)
                    return res.status(200).send('OK')
                }
            } else {
                console.log(`ERROR ${err.stack}`)
                return res.status(500).send(err)
            }
        })*/
        const filePath = `${ imageDir }/${ fileName }`
        if(fs.statSync(filePath).isFile()){
            fs.unlink(filePath , err => {
                if(!err){
                    return res.status(200).json('OK')      
                } else {
                    return res.status(500).json({ error: 'Ошибка удаления файла'})
                }
            })
        }
    })
    
    return gallery    
}