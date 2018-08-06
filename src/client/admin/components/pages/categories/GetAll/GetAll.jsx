import React from 'react'
import { Link } from 'react-router-dom'
import _ from 'lodash'

import {
    getCategories as getCategoriesApi,
    deleteCategory as deleteCategoryApi
} from 'client/admin/api/categories'

const Collapse = require('antd/lib/collapse')
require('antd/lib/collapse/style/css')
const Panel = Collapse.Panel
const Button = require('antd/lib/button')
require('antd/lib/button/style/css')
const Spin = require('antd/lib/spin')
require('antd/lib/spin/style/css')
const message = require('antd/lib/message')
require('antd/lib/message/style/css')

import ContentList from 'client/admin/components/content/ContentList/ContentList.jsx'
import BreadcrumbsPanel from 'client/admin/components/content/BreadcrumbsPanel/BreadcrumbsPanel.jsx'

import l from  'client/admin/components/style/GetAll.less'

class GetAll extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            categories: []
        }
    }

    componentWillMount(){
        { console.log('this.props', this.props) }
        try {
            return getCategoriesApi()
            .then(categories => {
                this.setState({ categories: categories })
            })

        } catch(err) {
            console.log(`ERROR ${err.stack}`)
        }
    }

    deleteCategory(nameUrl){
        const { categories } = this.state
        try {
            return deleteCategoryApi(nameUrl)
            .then(data => {
                if(data.status == 'OK'){
                    const category = categories[_.findIndex(categories, category => {
                        return category.nameUrl == nameUrl
                    })]
                    this.setState({ categories: _.pull(categories, category) }, () => {
                        message.success(`Категория ${ category.shortName } успешно удалена`)
                    })
                }
            })
        } catch(err) {
            console.log(`ERROR ${err.stack}`)
        }
    }

    render(){
        const { categories } = this.state
        if(categories){
            return (
                <div className={ l.root }>
                    <BreadcrumbsPanel
                        history={ this.props.history }
                        backButton={ false }
                        links={[
                            { url: '/categories', text: 'Категории' }
                        ]}
                    />
                    <Link to='/categories/create'>
                        <Button className={ l.create }>+</Button>
                    </Link>
                    <ContentList
                        items={ categories }
                        apiName='categories'
                        viewProperties={[
                            { value: 'image', type: 'image' },
                            { value: 'shortName', type: 'string' }
                        ]}
                        nameUrl='nameUrl'
                        onDelete={ nameUrl => this.deleteCategory(nameUrl) }
                    />
                </div>
            )
        } else return ( <Spin/> )
    }
}

export default GetAll
