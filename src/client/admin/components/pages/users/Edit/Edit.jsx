import React from 'react'
import { string } from 'prop-types'
import { Link } from 'react-router-dom'

import { 
    getUser as getUserApi,
    createUser as createUserApi,
    editUser as editUserApi
} from 'client/admin/api/users'
import {
    getCities as getCitiesApi
} from 'client/admin/api/cities'
import config from 'client/../config/client'

const Row = require('antd/lib/row')
require('antd/lib/row/style/css')
const Col = require('antd/lib/col')
require('antd/lib/col/style/css')
const Form = require('antd/lib/form')
require('antd/lib/form/style/css')
const Button = require('antd/lib/button')
require('antd/lib/button/style/css')
const Input = require('antd/lib/input')
require('antd/lib/input/style/css')
const FormItem = Form.Item
const Icon = require('antd/lib/icon')
require('antd/lib/icon/style/css')
const Spin = require('antd/lib/spin')
require('antd/lib/spin/style/css')
const message = require('antd/lib/message')
require('antd/lib/message/style/css')
const Select = require('antd/lib/select')
require('antd/lib/select/style/css')
const Option = Select.Option

import l from './Edit.less'

class Edit extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            userInitial: null,
            user: null,            
            isCreated: false,            
            cities: []
        }
    }
    
    componentWillMount(){
        if(this.props.type == 'create'){
            const empty = {
                login: '',
                password: '',
                fio: '',
                phone: '',
                role: null,                
                city: null
            }
            this.setState({ 
                userInitial: empty,
                user: empty 
            })
        } else {
            const { login } = this.props.match.params
            try {
                return getUserApi(login)
                .then(user => {
                    this.setState({ 
                        userInitial: user,
                        user: user
                    }, () => {
                        this.setAllInputs(this.state.user)
                    })
                })
            } catch(err) {
                console.log(`ERROR ${err.stack}`)
            }
        }
        
    }

    componentDidMount(){
        try {
            return getCitiesApi()
            .then(cities => {
                this.setState({ cities: cities })
            })
        } catch(err) {
            console.log(`ERROR ${err.stack}`)
        }
    }

    async handleSave(e){
        const isCreateType = this.props.type == 'create'
        
        e.preventDefault()
        this.props.form.validateFields((err, values) => {
            if (!err) {
                console.log('VALUES: ', values)
                if(isCreateType){
                    try {
                        return createUserApi(values)
                        .then(user => {
                            this.setState({ isCreated: true }, () => {
                                message.success(`Работник ${user.fio} создан.`)
                            })
                        })
                    } catch(err) {
                        message.error(`Работник ${user.fio} не создан.`)
                        console.log(`ERROR ${err.stack}`)
                    }
                } else {
                    const { login } = this.props.match.params
                    try {
                        return editUserApi(login, values)
                        .then(user => {
                            message.success(`Работник ${user.fio} отредактирован.`)
                        })
                    } catch(err) {
                        message.error(`Работник ${user.fio} не отредактирован.`)
                        console.log(`ERROR ${err.stack}`)
                    }
                }

            } else {
                console.log(`ERROR ${err.stack}`)
            }
        })
    }

    cancelChanges(){
        this.setAllInputs(this.state.userInitial)
    }

    setAllInputs(user){        
        if(user.login){
            this.onLoginChange(user.login)
        }            
        if(user.password){
            this.onPasswordChange(user.password)
        }        
        if(user.role){
            this.onRoleChange(user.role)
        }
        if(user.fio){
            this.onFioChange(user.fio)
        }
        if(user.city){
            this.onCityChange(user.city)
        }
        if(user.phone){
            this.onPhoneChange(user.phone)
        }
    }

    onLoginChange(val){
        this.props.form.setFieldsValue({ login: val })
    }
    onPasswordChange(val){
        this.props.form.setFieldsValue({ password: val })
    }
    onRoleChange(val){
        this.props.form.setFieldsValue({ role: val })
    }    
    onFioChange(val){
        this.props.form.setFieldsValue({ fio: val })
    }
    onCityChange(val){
        this.props.form.setFieldsValue({ city: val })
    }
    onPhoneChange(val){
        this.props.form.setFieldsValue({ phone: val })
    }
    
    render(){
        const { 
            user,
            isCreated,
            cities
        } = this.state
        const { getFieldDecorator }  = this.props.form
        const isCreateType = this.props.type == 'create'
        if(user){
            return (
                <Row className={ l.root }>
                    <Form onSubmit = { e => this.handleSave(e) }>
                        <Col sm={24} md={4}>
                            <FormItem>
                                { !isCreated ?
                                    <Button 
                                        type='primary'
                                        htmlType='submit'
                                    >Сохранить</Button>
                                    : <Button 
                                        type='primary'
                                    >
                                        <Link to='/users/'>Назад</Link>
                                    </Button>
                                }
                                { !isCreateType &&
                                    <Button
                                        onClick={ e => this.cancelChanges() }
                                    >Отменить изменения</Button>
                                }
                            </FormItem>
                        </Col>
                        <Col sm={24} md={20}>                            
                            <FormItem label='Фамилия Имя Отчество' className={ l.formItem }>
                                {getFieldDecorator('fio', { rules: [
                                    { required: true, message: 'Обязательное поле' }
                                ] })(
                                    <Input
                                        onChange={ val => this.onFioChange(val) } 
                                    />
                                )}
                            </FormItem>

                            <FormItem label='Логин'  className={ l.formItem }>
                                {getFieldDecorator('login', { rules: [
                                    { required: true, message: 'Обязательное поле' }
                                ] })(
                                    <Input
                                        onChange={ val => this.onLoginChange(val) } 
                                    />
                                )}
                            </FormItem>
                            
                            <FormItem label='Пароль'  className={ l.formItem }>
                                {getFieldDecorator('password', { rules: [
                                    { required: false, message: 'Обязательное поле' }
                                ] })(
                                    <Input
                                        onChange={ val => this.onPasswordChange(val) } 
                                    />
                                )}
                            </FormItem>
                            
                            <FormItem label='Роль'  className={ l.formItem }>
                                {getFieldDecorator('role', { rules: [
                                    { required: true, message: 'Обязательное поле' }
                                ] })(
                                    <Select onChange={ val => this.onRoleChange(val) }>
                                        { 
                                            config.userRoles.map(role => (
                                                <Option 
                                                    value={ role }
                                                    key={ role }
                                                >{ role }</Option>
                                            )) 
                                        }
                                    </Select>
                                )}
                            </FormItem>
                            <FormItem label='Город'  className={ l.formItem }>
                                {getFieldDecorator('city', { rules: [
                                    { required: true, message: 'Обязательное поле' }
                                ] })(
                                    <Select onChange={ val => this.onCityChange(val) }>
                                        { 
                                            cities && cities.map(city => (
                                                <Option 
                                                    value={ city.name }
                                                    key={ city.name }
                                                >{ city.name }</Option>
                                            )) 
                                        }
                                    </Select>
                                )}
                            </FormItem>
                            <FormItem label='Телефон'  className={ l.formItem }>
                                {getFieldDecorator('phone', { rules: [
                                    { required: true, message: 'Обязательное поле' }
                                ] })(
                                    <Input
                                        onChange={ val => this.onPhoneChange(val) } 
                                    />
                                )}
                            </FormItem>                           
                        </Col>
                    </Form>
                </Row>
            )
        } else return ( <Spin/> )        
    }
}

Edit.propTypes = {
    type: string
}

const EditForm = Form.create()(Edit)
export default EditForm