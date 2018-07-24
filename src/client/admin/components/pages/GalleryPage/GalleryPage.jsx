import React from 'react'

import UploadImage from './UploadImage/UploadImage.jsx'
import config from 'client/../config/client'

const Spin = require('antd/lib/spin')
require('antd/lib/spin/style/css')
const List = require('antd/lib/list')
require('antd/lib/list/style/css')
const Card = require('antd/lib/card')
require('antd/lib/card/style/css')
const { Meta } = Card
const Avatar = require('antd/lib/avatar')
require('antd/lib/avatar/style/css')

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
            return fetch(`/gallery`,{
                method: 'GET',
                credentials: 'include',
            })
            .then(res => res.json())
            .then(images => {
                console.log(images)
                this.setState({ images: images })
            })
        } catch(err) {
            console.log(`ERROR ${err.stack}`)
        }
    }

    onUploadImageHandler(fileName){
        console.log(fileName)
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
                                pageSize: 8,
                            }}
                            dataSource={ images }
                            renderItem={ image => (
                                <List.Item
                                    key={ image }
                                >
                                    <Card 
                                        cover={ <img src={ `${ config.assetsPath }/imgs/${ image }` } /> }
                                        hoverable
                                    >
                                        <Meta
                                            title={ image }
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