import React from 'react'
import { Link } from 'react-router-dom'
import _ from 'lodash'

import { 
    getUsers as getUsersApi,
    deleteUser as deleteUserApi
} from 'client/admin/api/users'

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
            users: []
        }
    }

    componentWillMount(){
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

    render(){
        const { users } = this.state
        if(users){
            return (
                <div className={ l.root }>
                    <Link to='/users/create'>
                        <Button className={ l.create }>+</Button>
                    </Link>
                    <ContentList 
                        items={ users } 
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