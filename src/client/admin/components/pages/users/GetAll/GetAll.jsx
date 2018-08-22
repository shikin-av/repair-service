import React from 'react'
import { Link } from 'react-router-dom'
import _ from 'lodash'

import {
    getUsers as getUsersApi,
    deleteUser as deleteUserApi
} from 'client/admin/api/users'

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
import getCookie from 'client/admin/resources/getCookie'
import BreadcrumbsPanel from 'client/admin/components/content/BreadcrumbsPanel/BreadcrumbsPanel.jsx'
import LoadedContentView from 'client/admin/components/content/LoadedContentView/LoadedContentView.jsx'

import l from  'client/admin/components/style/GetAll.less'

class GetAll extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            users: [],
            usersByOnlyCity: true,
            loadStatus: 'load'
        }
    }

    componentWillMount(){
        this.userCityNameUrl = getCookie('userCityNameUrl')

        try {
            return getUsersApi()
            .then(users => {
                if(users.length){
                    this.setState({ 
                        users: users,
                        loadStatus: 'complete'
                    })    
                } else {
                    this.setState({ 
                        users: [],
                        loadStatus: 'empty'
                    }) 
                }
                
            })

        } catch(err) {
            console.log(`ERROR ${err.stack}`)
        }
    }

    deleteUser(login){
        const { users } = this.state
        try {
            deleteUserApi(login)
            .then(data => {
                if(data.status == 'OK'){
                    const user = users[_.findIndex(users, user => {
                        return user.login == login
                    })]
                    this.setState({ users: _.pull(users, user) }, () => {
                        message.success(`Работник ${ user.fio } успешно удален`)
                    })
                }
            })
        } catch(err) {
            console.log(`ERROR ${err.stack}`)
        }
    }

    checkOnlyCity(e){
        this.setState({ usersByOnlyCity: e.target.checked })
    }

    render(){
        const { users, usersByOnlyCity, loadStatus } = this.state 
        let resultUsers = users    
        if(usersByOnlyCity){
            resultUsers = users.filter(user => {
                return user.cityNameUrl == this.userCityNameUrl
            })
        }
        return (
            <div className={ l.root }>
                <BreadcrumbsPanel
                    history={ this.props.history }
                    backButton={ false }
                    links={[
                        { url: '/users', text: 'Работники' }
                    ]}
                />
                <Link to='/users/create'>
                    <Button className={ l.create }>+</Button>
                </Link>

                { 
                    this.userCityNameUrl &&
                    <Checkbox
                        onChange={ e => this.checkOnlyCity(e) }
                        checked={ usersByOnlyCity }
                    >Работники только Вашего города</Checkbox>
                }
                <LoadedContentView
                    loadStatus={ loadStatus }
                    message='Добавьте первого работника'
                >
                    <ContentList
                        onDelete={ identificator => this.deleteUser(identificator) }
                    >
                    {
                        resultUsers.map(user => {
                            return {
                                element: (
                                    <Row key={ Math.random() } className={ l.row }>
                                        <Col sm={24} md={4}>
                                            <span>{ user.fio }</span>
                                        </Col>
                                        <Col sm={24} md={4}>
                                            <span>{ user.city }</span>
                                        </Col>
                                        <Col sm={24} md={4}>
                                            <span>{ user.role }</span>
                                        </Col>
                                    </Row>
                                ),
                                editLink: `/users/${ user.login }`,
                                identificator: user.login,
                                deleteText: `Удалить работника ${ user.fio }`
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
