import React from 'react'
import { func } from 'prop-types'

import { uploadUrl } from 'client/admin/api/gallery'

const Form = require('antd/lib/form')
require('antd/lib/form/style/css')
const Button = require('antd/lib/button')
require('antd/lib/button/style/css')
const Input = require('antd/lib/input')
require('antd/lib/input/style/css')
const FormItem = Form.Item
const Upload = require('antd/lib/upload')
require('antd/lib/upload/style/css')
const Icon = require('antd/lib/icon')
require('antd/lib/icon/style/css')
const message = require('antd/lib/message')
require('antd/lib/message/style/css')

import l from './UploadImage.less'

class UploadImage extends React.Component {
    constructor(props){
        super(props)
    }

    onChangeImage(e){
        if(e.file.status == 'done') {
            message.success(`Файл ${ e.file.name } успешно загружен`)
            this.props.onUploadImage(e.file.name)

        } else if (e.file.status == 'error') {
            message.error(`Файл ${ e.file.name } не загружен`)
            console.log(`ERROR ${err.stack}`)
        }
    }    

    beforeUpload(file){
        const isImage = (file.type === 'image/jpeg' || file.type === 'image/png')
        if (!isImage) {
            message.error('Файл должен иметь расширение .jpeg или .png')
        }
        const isSize = file.size / 1024 / 1024 < 2
        if (!isSize) {
            message.error('Размер файла должен быть менее 2 Мб')
        }
        return isImage && isSize
    }

    render(){
        return (
            <div className={ l.root }>
                <Upload
                    name='image'
                    action={ uploadUrl }
                    onChange = { e => this.onChangeImage(e) }
                    beforeUpload={ file => this.beforeUpload(file) }
                    multiple={ true }
                    showUploadList={ false }
                >
                    <Button>
                        <Icon type="upload" /> Загрузить изображение
                    </Button>
                </Upload>
            </div>
        )
    }
}

UploadImage.propTypes = {
    onUploadImage: func.isRequired
}

export default UploadImage