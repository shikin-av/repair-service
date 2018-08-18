import React from 'react'
import { Link } from 'react-router-dom'
import _ from 'lodash'

import {
    getTexts as getTextsApi,
    deleteText as deleteTextApi
} from 'client/admin/api/texts'

const Button = require('antd/lib/button')
require('antd/lib/button/style/css')
const message = require('antd/lib/message')
require('antd/lib/message/style/css')
const Checkbox = require('antd/lib/checkbox')
require('antd/lib/checkbox/style/css')
const Row = require('antd/lib/row')
require('antd/lib/row/style/css')
const Col = require('antd/lib/col')
require('antd/lib/col/style/css')

import ContentList from 'client/admin/components/content/ContentList/ContentList.jsx'
import BreadcrumbsPanel from 'client/admin/components/content/BreadcrumbsPanel/BreadcrumbsPanel.jsx'
import LoadedContentView from 'client/admin/components/content/LoadedContentView/LoadedContentView.jsx'

import l from  'client/admin/components/style/GetAll.less'

class GetAll extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            texts: [],
            loadStatus: 'load'
        }
    }

    componentWillMount(){
        try {
            return getTextsApi()
            .then(texts => {
                if(texts.length){
                    this.setState({ 
                        texts: texts,
                        loadStatus: 'complete'
                    })    
                } else {
                    this.setState({ 
                        texts: [],
                        loadStatus: 'empty'
                    }) 
                }
                
            })

        } catch(err) {
            console.log(`ERROR ${err.stack}`)
        }
    }

    deleteText(nameUrl){
        const { texts } = this.state
        try {
            deleteTextApi(nameUrl)
            .then(data => {
                if(data.status == 'OK'){
                    const text = texts[_.findIndex(texts, text => {
                        return text.nameUrl == nameUrl
                    })]
                    this.setState({ texts: _.pull(texts, text) }, () => {
                        message.success(`Текст ${ text.title } успешно удален`)
                    })
                }
            })
        } catch(err) {
            console.log(`ERROR ${err.stack}`)
        }
    }

    render(){
        const { texts, loadStatus } = this.state        
        return (
            <div className={ l.root }>
                <BreadcrumbsPanel
                    history={ this.props.history }
                    backButton={ false }
                    links={[
                        { url: '/texts', text: 'Контент' }
                    ]}
                />
                <Link to='/texts/create'>
                    <Button className={ l.create }>+</Button>
                </Link>

                <LoadedContentView
                    loadStatus={ loadStatus }
                    message='Добавьте первый текст для сайта'
                >
                    <ContentList
                        onDelete={ identificator => this.deleteText(identificator) }
                    >
                    {
                        texts.map(text => {
                            return {
                                element: (
                                    <Row key={ Math.random() } className={ l.row }>
                                        <Col sm={24} md={4}>
                                            <span>{ text.nameUrl }</span>
                                        </Col>
                                        <Col sm={24} md={20}>
                                            <span>{ text.title }</span>
                                        </Col>                                        
                                    </Row>
                                ),
                                editLink: `/texts/${ text.nameUrl }`,
                                identificator: text.nameUrl,
                                deleteText: `Удалить текст ${ text.title }`
                            }    
                        })
                    }
                    </ContentList>
                </LoadedContentView>
            </div>
        )        
    }

}

export default GetAll