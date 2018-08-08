import React from 'react'
import { Link } from 'react-router-dom'
import _ from 'lodash'

import {
    getCities as getCitiesApi,
    deleteCity as deleteCityApi
} from 'client/admin/api/cities'

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
            cities: [],
            loadStatus: 'load'
        }
    }

    componentWillMount(){
        try {
            return getCitiesApi()
            .then(cities => {
                if(cities.length){
                    this.setState({ 
                        cities: cities,
                        loadStatus: 'complete'
                    })
                } else {
                    this.setState({ 
                        cities: [],
                        loadStatus: 'empty'
                    })
                }
                
            })

        } catch(err) {
            console.log(`ERROR ${err.stack}`)
        }
    }

    deleteCity(nameUrl){
        const { cities } = this.state
        try {
            return deleteCityApi(nameUrl)
            .then(data => {
                if(data.status == 'OK'){
                    const city = cities[_.findIndex(cities, city => {
                        return city.nameUrl == nameUrl
                    })]
                    this.setState({ cities: _.pull(cities, city) }, () => {
                        message.success(`Офис ${ city.name } успешно удален`)
                    })
                }
            })
        } catch(err) {
            console.log(`ERROR ${err.stack}`)
        }
    }

    render(){
        const { cities, loadStatus } = this.state
        
        return (
            <div className={ l.root }>
                <BreadcrumbsPanel
                    history={ this.props.history }
                    backButton={ false }
                    links={[
                        { url: '/cities', text:'Офисы' }
                    ]}
                />
                <Link to='/cities/create'>
                    <Button className={ l.create }>+</Button>
                </Link>
                <LoadedContentView
                    loadStatus={ loadStatus }
                    message='Добавьте первый офис'
                >
                    <ContentList
                        items={ cities }
                        apiName='cities'
                        viewProperties={[
                            { value: 'name', type: 'string' },
                            { value: 'phone', type: 'string' },
                            { value: 'officeAddress', type: 'string' }
                        ]}
                        nameUrl='nameUrl'
                        onDelete={ nameUrl => this.deleteCity(nameUrl) }
                    />
                </LoadedContentView>
            </div>
        )
        
    }
}

export default GetAll
