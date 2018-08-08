import React from 'react'
import _ from 'lodash'
import { func, bool } from 'prop-types'

import { 
    getImages as getImagesApi,
    deleteImage as deleteImageApi
} from 'client/admin/api/gallery'
import UploadImage from 'client/admin/components/content/UploadImage/UploadImage.jsx'
import config from 'config/client'
import LoadedContentView from 'client/admin/components/content/LoadedContentView/LoadedContentView.jsx'

const List = require('antd/lib/list')
require('antd/lib/list/style/css')
const Card = require('antd/lib/card')
require('antd/lib/card/style/css')
const { Meta } = Card
const Icon = require('antd/lib/icon')
require('antd/lib/icon/style/css')
const message = require('antd/lib/message')
require('antd/lib/message/style/css')
const Popconfirm = require('antd/lib/popconfirm')
require('antd/lib/popconfirm/style/css')

import l from './Gallery.less'

class Gallery extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            images: [],
            selected: null,
            loadStatus: 'load'
        }
    }

    componentWillMount(){
        this.loadImages()
    }

    async loadImages(){
        try {
            return getImagesApi()
            .then(images => {
                if(images.length){
                    this.setState({ 
                        images: images,
                        loadStatus: 'complete'
                    })    
                } else {
                    this.setState({ 
                        images: [],
                        loadStatus: 'empty'
                    }) 
                }
                
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

    selectImage(fileName){
        if(this.props.onClickToImage){
            let select = null
            if(this.state.selected != fileName){
                select = fileName
            } 
            this.setState({ selected: select }, () => {
                this.props.onClickToImage(select)
            })
        }        
    }

    render(){
        const { images, selected, loadStatus } = this.state
        const { onClickToImage, inModal } = this.props
        const grid      = { gutter: 16, xs: 1, sm: 2, md: 4, lg: 4, xl: 6, xxl: 3 }
        const modalGrid = { gutter: 8, xs: 1, sm: 2, md: 4, lg: 4, xl: 4, xxl: 3 }
        
            return (
                <div className={ l.root }>
                    <UploadImage onUploadImage={ fileName => this.onUploadImageHandler(fileName) } />
                    <LoadedContentView
                        loadStatus={ loadStatus }
                        message='Загрузите первое изображение'
                    >
                        <List
                            grid={ inModal ? modalGrid : grid }
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
                                        hoverable={ this.props.onClickToImage ? true : false }
                                        className={ (selected == fileName && onClickToImage) ? l.selected : null }
                                        actions={[
                                            <Popconfirm 
                                                title={ `Удалить ${ fileName } ?` } 
                                                onConfirm={ e => this.deleteImage(fileName) } 
                                                onCancel={ null } 
                                                okText="Да" 
                                                cancelText="Нет"
                                            >
                                                <Icon type='delete'/>
                                            </Popconfirm>
                                        ]}
                                        onClick={ e => this.selectImage(fileName) }
                                    >
                                        <Meta 
                                            description={ fileName }
                                        />
                                    </Card>
                                </List.Item>
                            )}
                        />
                    </LoadedContentView>
                </div>
            )
        
    }
}

Gallery.propTypes = {
    onClickToImage: func,
    inModal: bool
}

export default Gallery