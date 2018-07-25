import React from 'react'
import _ from 'lodash'

import { 
    getImages as getImagesApi,
    deleteImage as deleteImageApi
} from 'client/admin/api/gallery'
import UploadImage from 'client/admin/components/content/UploadImage/UploadImage.jsx'
import config from 'client/../config/client'

const Spin = require('antd/lib/spin')
require('antd/lib/spin/style/css')
const List = require('antd/lib/list')
require('antd/lib/list/style/css')
const Card = require('antd/lib/card')
require('antd/lib/card/style/css')
const { Meta } = Card
const Icon = require('antd/lib/icon')
require('antd/lib/icon/style/css')
const message = require('antd/lib/message')
require('antd/lib/message/style/css')

import l from './GalleryPage.less'

class GalleryPage extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            images: []
        }
    }

    componentWillMount(){
        this.loadImages()
    }

    async loadImages(){
        try {
            return getImagesApi()
            .then(images => {
                this.setState({ images: images })
            })
        } catch(err) {
            console.log(`ERROR ${err.stack}`)
        }
    }

    onUploadImageHandler(fileName){
        this.setState({
            images: [fileName, ...this.state.images]
        })
    }

    deleteImage(fileName){        
        try {
            return deleteImageApi(fileName)
            .then(res => {
                if(res.error){
                    message.error(`Не удалось удалить файл ${ fileName }`)
                } else if(res == 'OK'){                    
                    this.setState({
                        images: _.pull(this.state.images, fileName)
                    }, () => {
                        message.success(`Файл ${ fileName } успешно удален`)
                    })
                }
            })
        } catch(err) {
            console.log(`ERROR ${err.stack}`)
        }
    }

    render(){
        const { images } = this.state
        if(images){
            return (
                <div className={ l.root }>
                    <UploadImage onUploadImage={ fileName => this.onUploadImageHandler(fileName) } />
                    <div>
                        <List
                            grid={{ gutter: 16, xs: 1, sm: 2, md: 4, lg: 4, xl: 6, xxl: 3 }}
                            pagination={{
                                onChange: (page) => {
                                    console.log(page)
                                },
                                pageSize: 24,
                            }}
                            dataSource={ images }
                            renderItem={ fileName => (
                                <List.Item
                                    key={ fileName }
                                >
                                    <Card 
                                        cover={ <img src={ `${ config.assetsPath }/imgs/${ fileName }` } /> }
                                        hoverable
                                        className={ l.card }
                                        actions={[
                                            <Icon 
                                                type='delete'
                                                onClick={ e => this.deleteImage(fileName) } 
                                            />
                                        ]}
                                    >
                                        <Meta 
                                            description={ fileName }
                                        />
                                    </Card>
                                </List.Item>
                            )}
                        />
                    </div>
                </div>
            )
        } else return ( <Spin/> )
        
    }
}

export default GalleryPage