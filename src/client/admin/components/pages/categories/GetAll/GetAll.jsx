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
const message = require('antd/lib/message')
require('antd/lib/message/style/css')

import ContentList from 'client/admin/components/content/ContentList/ContentList.jsx'
import BreadcrumbsPanel from 'client/admin/components/content/BreadcrumbsPanel/BreadcrumbsPanel.jsx'
import LoadedContentView from 'client/admin/components/content/LoadedContentView/LoadedContentView.jsx'

import l from  'client/admin/components/style/GetAll.less'

class GetAll extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            categories: [],
            loadStatus: 'load'
        }
    }

    componentWillMount(){
        { console.log('this.props', this.props) }
        try {
            return getCategoriesApi()
            .then(categories => {
                if(categories.length){
                    this.setState({ 
                        categories: categories,
                        loadStatus: 'complete'
                    })
                } else {
                    this.setState({ 
                        categories: [],
                        loadStatus: 'empty' 
                    })
                }
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
        const { categories, loadStatus } = this.state
        
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
                <LoadedContentView
                    loadStatus={ loadStatus }
                    message='Добавьте первую категорию техники'
                >
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
                </LoadedContentView>
            </div>
        )    
    }
}

export default GetAll
