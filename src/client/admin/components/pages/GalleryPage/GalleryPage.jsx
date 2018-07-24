import React from 'react'

import UploadImage from './UploadImage/UploadImage.jsx'
import config from 'client/../config/client'

const Spin = require('antd/lib/spin')
require('antd/lib/spin/style/css')

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
                <div>
                    <UploadImage onUploadImage={ fileName => this.onUploadImageHandler(fileName) } />
                </div>
            )
        } else return ( <Spin/> )
        
    }
}

export default GalleryPage