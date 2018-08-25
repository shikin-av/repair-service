import React from 'react'

import { getCategories as getCategoriesApi } from 'client/site/api'

import CategoryItem from 'client/site/components/content/CategoryItem/CategoryItem.jsx'

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
            categories: []
        }
    }

    componentWillMount(){        
        try {
            getCategoriesApi()
            .then(categories => {
                if(!categories.error){
                    this.setState({ categories: categories })
                }                
            })

        } catch(err) {
            message.error('Ошибка загрузки категорий')
        }
    }

    render(){
        const { categories } = this.state
        if(categories){
            return (
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
            )
        } else return ( <Spin/> )
    }
}

export default Categories