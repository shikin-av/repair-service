import React from 'react'
import { Link } from 'react-router-dom'
import _ from 'lodash'

import {
    getUsers as getUsersApi,
    deleteUser as deleteUserApi
} from 'client/admin/api/users'

const Button = require('antd/lib/button')
require('antd/lib/button/style/css')
const Spin = require('antd/lib/spin')
require('antd/lib/spin/style/css')
const message = require('antd/lib/message')
require('antd/lib/message/style/css')
const Checkbox = require('antd/lib/checkbox')
require('antd/lib/checkbox/style/css')

import ContentList from 'client/admin/components/content/ContentList/ContentList.jsx'
import getCookie from 'client/admin/resources/getCookie'
import BreadcrumbsPanel from 'client/admin/components/content/BreadcrumbsPanel/BreadcrumbsPanel.jsx'

import l from  'client/admin/components/style/GetAll.less'

class GetAll extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            users: [],
            usersOnlyCity: true
        }
    }

    componentWillMount(){
        this.userCityNameUrl = getCookie('userCityNameUrl')

        try {
            return getUsersApi()
            .then(users => {
                this.setState({ users: users })
            })

        } catch(err) {
            console.log(`ERROR ${err.stack}`)
        }
    }

    deleteUser(login){
        const { users } = this.state
        try {
            return deleteUserApi(login)
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
        this.setState({ usersOnlyCity: e.target.checked })
    }

    render(){
        const { users, usersOnlyCity } = this.state
        if(users){
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

                    { this.userCityNameUrl &&
                    <Checkbox
                        onChange={ e => this.checkOnlyCity(e) }
                        checked={ usersOnlyCity }
                    >Работники только Вашего города</Checkbox>
                    }

                    <ContentList
                        items={
                            (this.userCityNameUrl && usersOnlyCity)
                            ? users.filter(user => {
                                return user.cityNameUrl == this.userCityNameUrl
                            })
                            :users
                        }
                        apiName='users'
                        viewProperties={[
                            { value: 'fio', type: 'string' },
                            { value: 'city', type: 'string' },
                            { value: 'role', type: 'string' }
                        ]}
                        nameUrl='login'
                        onDelete={ login => this.deleteUser(login) }
                    />
                </div>
            )
        } else return ( <Spin/> )
    }
}

export default GetAll
