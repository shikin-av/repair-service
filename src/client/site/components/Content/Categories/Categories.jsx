import React from 'react'

import { getCategories as getCategoriesApi } from 'client/site/api'

import CategoryItem from 'client/site/components/content/CategoryItem/CategoryItem.jsx'
import LoadedContentView from 'client/admin/components/content/LoadedContentView/LoadedContentView.jsx'

const Row = require('antd/lib/row')
require('antd/lib/row/style/css')
const Col = require('antd/lib/col')
require('antd/lib/col/style/css')
const Spin = require('antd/lib/spin')
require('antd/lib/spin/style/css')

import l from './Categories.less'

class Categories extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            categories: [],
            loadStatus: 'load',
        }
    }

    componentWillMount(){        
        try {
            getCategoriesApi()
            .then(categories => {
                if(!categories.error){
                    this.setState({ 
                        categories, 
                        loadStatus: 'complete'
                    })
                }                
            })

        } catch(err) {
            this.setState({loadStatus: 'empty'})
        }
    }

    render(){
        const { categories, loadStatus } = this.state
        if(categories){
            return (
                <LoadedContentView
                    loadStatus={ loadStatus }
                    message='Ошибка загрузки категорий'
                >
                    <Row gutter={16}>                    
                        {
                            categories.map(category => (
                                <Col
                                    xs={24}
                                    sm={12}
                                    md={6}
                                    key={ category.nameUrl }
                                >
                                    <CategoryItem category={ category } />
                                </Col>
                            ))
                        }                    
                    </Row>
                </LoadedContentView>
            )
        } else return ( <Spin/> )
    }
}

export default Categories