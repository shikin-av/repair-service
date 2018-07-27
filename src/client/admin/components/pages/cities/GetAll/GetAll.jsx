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
const Spin = require('antd/lib/spin')
require('antd/lib/spin/style/css')
const message = require('antd/lib/message')
require('antd/lib/message/style/css')

import ContentList from 'client/admin/components/content/ContentList/ContentList.jsx'

import l from './GetAll.less'

class GetAll extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            cities: []
        }
    }

    componentWillMount(){
        try {
            return getCitiesApi()
            .then(cities => {
                this.setState({ cities: cities })
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
        const { cities } = this.state
        if(cities){
            return (
                <div className={ l.root }>
                    <Link to='/cities/create'>
                        <Button className={ l.create }>+</Button>
                    </Link>
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
                </div>
            )
        } else return ( <Spin/> )        
    }
}

export default GetAll