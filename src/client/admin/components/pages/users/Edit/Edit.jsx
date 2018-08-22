import React from 'react'
import { string } from 'prop-types'
import _ from 'lodash'

import {
    getUser    as getUserApi,
    createUser as createUserApi,
    editUser   as editUserApi,
    deleteUser as deleteUserApi
} from 'client/admin/api/users'
import {
    getCities as getCitiesApi
} from 'client/admin/api/cities'
import {
    getCategories as getCategoriesApi
} from 'client/admin/api/categories'
import config from 'config/client'
import BreadcrumbsPanel from 'client/admin/components/content/BreadcrumbsPanel/BreadcrumbsPanel.jsx'
import LoadedContentView from 'client/admin/components/content/LoadedContentView/LoadedContentView.jsx'

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
const message = require('antd/lib/message')
require('antd/lib/message/style/css')
const Select = require('antd/lib/select')
require('antd/lib/select/style/css')
const Option = Select.Option
const Checkbox = require('antd/lib/checkbox')
require('antd/lib/checkbox/style/css')
const CheckboxGroup = Checkbox.Group
const Popconfirm = require('antd/lib/popconfirm')
require('antd/lib/popconfirm/style/css')
const Alert = require('antd/lib/alert')
require('antd/lib/alert/style/css')

import l from 'client/admin/components/style/Edit.less'

class Edit extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            userInitial:      null,
            user:             null,
            isCreated:        false,
            isDeleted:        false,
            cities:           [],
            workingDays:      config.defaultWorkingDays,
            categories:       [],
            allCategories:    [],
            loadStatus:       'load',
            breadcrumbsLinks: [{ url: '/users', text:'Работники' }],
            title: null,
        }
    }

    emptyUser(){
        this.setState({
            loadStatus: 'empty',
            breadcrumbsLinks: [
                { url: '/users', text:'Работники' },
            ]
        })
    }

    getUser(login){
        try {
            return getUserApi(login)
            .then(user => {
                if(!user.error){
                    this.setState({
                        userInitial:      user,
                        user:             user,
                        loadStatus:       'complete',
                        breadcrumbsLinks: [
                            { url: '/users', text:'Работники' },
                            { url: user.login, text: user.fio }
                        ],
                        title: user.fio
                    }, () => {
                        this.setAllInputs(this.state.user)
                    })
                } else {
                    this.emptyUser()
                }                
            })
        } catch(err) {
            console.log(`ERROR ${err.stack}`)
            this.emptyUser()
        }
    }

    componentWillMount(){
        if(this.props.type == 'create'){
            const empty = {
                login:            '',
                password:         '',
                fio:              '',
                phone:            '',
                role:             null,
                city:             null,
                workingDays:      config.defaultWorkingDays,
                categories:       []
            }
            this.setState({
                userInitial: empty,
                user: empty,
                loadStatus:       'complete',
                breadcrumbsLinks: [
                    { url: '/users', text:'Работники' },
                    { url: 'create', text: 'Новый работник' }
                ]
            })
        } else {
            const { login } = this.props.match.params
            this.getUser(login)
        }
    }

    componentWillReceiveProps(nextProps){
        if(this.props.match && this.props.match.params){
            const oldLogin = this.props.match.params.login
            const newLogin = nextProps.match.params.login
            if(newLogin != oldLogin){
                this.getUser(newLogin)
            }
        }        
    }

    getCategories(){
        try {
            return getCategoriesApi()
            .then(categories => {
                const checkboxOptions = categories.map(category => {
                    return {
                        label: category.shortName,
                        value: category.nameUrl
                    }
                })
                console.log('checkboxOptions ', checkboxOptions)
                this.setState({ allCategories: checkboxOptions })
            })
        } catch(err) {
            console.log(`ERROR ${err.stack}`)
        }
    }

    componentDidMount(){
        const { getFieldDecorator }  = this.props.form
        try {
            return getCitiesApi()
            .then(cities => {
                this.setState({ cities: cities }, () => {
                    this.getCategories()
                    getFieldDecorator('workingDays', { initialValue: config.defaultWorkingDays })
                    getFieldDecorator('categories',  { initialValue: [] })
                })
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
                if(values.phone[0] == '9'){
                    values.phone = '7' + values.phone
                }
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
        if(user.workingDays){
            this.onWorkingDaysChange(user.workingDays)
        }
        if(user.categories){
            this.onCategoriesChange(user.categories)
        }
    }

    onLoginChange(val){
        this.props.form.setFieldsValue({ login: val })
    }
    onPasswordChange(val){
        this.props.form.setFieldsValue({ password: val })
    }
    onRoleChange(val){
        const user = Object.assign({}, this.state.user)
        user.role = val
        this.setState({ user: user }, () => {
            this.props.form.setFieldsValue({ role: val })
        })
    }
    onFioChange(val){
        this.props.form.setFieldsValue({ fio: val })
    }
    onCityChange(val){
        const { cities } = this.state
        const { getFieldDecorator, setFieldsValue } = this.props.form

        console.log('cities ', cities)

        this.props.form.setFieldsValue({ city: val })

        if(cities.length){
            const cityId = _.findIndex(cities, city => {
                return city.name == val
            })
            const city = cities[cityId]
            //console.log('city ', city)
            const cityNameUrl = city.nameUrl

            getFieldDecorator('cityNameUrl', { initialValue: null })
            setFieldsValue({ cityNameUrl: cityNameUrl })
        }

    }
    onPhoneChange(val){        
        this.props.form.setFieldsValue({ phone: val })
    }

    onWorkingDaysChange(arr){
        this.props.form.setFieldsValue({ workingDays: arr })
    }

    onCategoriesChange(arr){
        this.props.form.setFieldsValue({ categories: arr })
    }

    deleteUser(){
        const { user } = this.state
        if(user){
            try {
                deleteUserApi(user.login)
                .then(data => {
                    if(data.status == 'OK'){
                        this.setState({ isDeleted: true })
                    }
                })
            } catch(err) {
                console.log(`ERROR ${err.stack}`)
                message.error(`Работник ${ user.fio } не удален.`)
            }    
        } 
    }

    render(){
        const {
            user,
            isCreated,
            isDeleted,
            cities,
            allCategories,
            loadStatus,
            breadcrumbsLinks,
            title
        } = this.state
        const { getFieldDecorator }  = this.props.form
        const isCreateType = this.props.type == 'create'

        return (
            <Row className={ l.root }>
                <BreadcrumbsPanel
                    history={ this.props.history }
                    backButton={ true }
                    links={ breadcrumbsLinks }
                />
                <LoadedContentView
                    loadStatus={ loadStatus }
                    message='Данного работника не существует'
                >
                    <h1>{ title }</h1>
                    {
                        (user && !isDeleted) ?
                        <Form onSubmit = { e => this.handleSave(e) }>                            
                            <FormItem>
                                { !isCreated &&
                                    <Button
                                        type='primary'
                                        htmlType='submit'
                                    >Сохранить</Button>
                                }
                                { !isCreateType &&
                                    <Button
                                        onClick={ e => this.cancelChanges() }
                                    >Отменить изменения</Button>
                                }
                                { 
                                    user && !isCreateType && !isDeleted &&
                                    <Popconfirm
                                        title={ `Удалить Работника ${ user.fio }?` }
                                        onConfirm={ () => this.deleteUser() }
                                        onCancel={ null }
                                        okText="Да"
                                        cancelText="Нет"
                                    >   
                                        <Button>
                                            <Icon type='delete' />
                                            Удалить работника
                                        </Button>                                    
                                    </Popconfirm>                                    
                                }
                            </FormItem>

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
                                        addonBefore='+7'
                                        onChange={ val => this.onPhoneChange(val) }
                                    />
                                )}
                            </FormItem>
                            { allCategories && user.role == 'работник' &&
                            <FormItem label='Виды техники'  className={ l.formItem }>
                                {getFieldDecorator('categories', { rules: [{
                                        required: user.role == 'работник' ? true : false,
                                        message: 'Обязательное поле'
                                }]})(
                                    <CheckboxGroup
                                        options={ allCategories }
                                    />
                                )}
                            </FormItem>
                            }
                            { user.role == 'работник' &&
                            <FormItem label='Рабочие дни'  className={ l.formItem }>
                                {getFieldDecorator('workingDays', { rules: [{
                                        required: user.role == 'работник' ? true : false,
                                        message: 'Обязательное поле'
                                }]})(
                                    <CheckboxGroup
                                        options={[
                                            { label: 'понедельник', value: 'понедельник' },
                                            { label: 'вторник',     value: 'вторник'     },
                                            { label: 'среда',       value: 'среда'       },
                                            { label: 'четверг',     value: 'четверг'     },
                                            { label: 'пятница',     value: 'пятница'     },
                                            { label: 'суббота',     value: 'суббота'     },
                                            { label: 'воскресенье', value: 'воскресенье' }
                                        ]}
                                    />
                                )}
                            </FormItem>
                        }
                        </Form>
                        : user &&
                        <Alert
                            type='info'
                            message={ `Работник ${ user.fio } успешно удален.` }
                        />
                    }
                </LoadedContentView>
            </Row>
        )        
    }
}

Edit.propTypes = {
    type: string
}

const EditForm = Form.create()(Edit)
export default EditForm
