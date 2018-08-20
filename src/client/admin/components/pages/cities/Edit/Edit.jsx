import React from 'react'
import { string } from 'prop-types'
import { Link } from 'react-router-dom'

import {
    getCity as getCityApi,
    createCity as createCityApi,
    editCity as editCityApi
} from 'client/admin/api/cities'
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
require('antd/lib/spin/style/css')
const message = require('antd/lib/message')
require('antd/lib/message/style/css')

import l from 'client/admin/components/style/Edit.less'

class Edit extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            cityInitial: null,
            city: null,
            isCreated: false,
            loadStatus: 'load',
            breadcrumbsLinks: [{ url: '/cities', text: 'Офисы' }]
        }
    }

    emptyCity(){
        this.setState({
            loadStatus: 'empty',
            breadcrumbsLinks: [
                { url: '/cities', text: 'Офисы' },
            ]
        })
    }

    getCity(nameUrl){
        try {
            return getCityApi(nameUrl)
            .then(city => {
                if(!city.error){
                    this.setState({
                        cityInitial: city,
                        city: city,
                        loadStatus: 'complete',
                        breadcrumbsLinks: [
                            { url: '/cities', text: 'Офисы' },
                            { url: city.nameUrl, text: city.name }
                        ]
                    }, () => {
                        this.setAllInputs(this.state.city)
                    })    
                } else {
                    this.emptyCity()
                }                
            })
        } catch(err) {
            console.log(`ERROR ${err.stack}`)
            this.emptyCity()
        }
    }

    componentWillMount(){
        if(this.props.type == 'create'){
            const empty = {
                name: '',
                nameUrl: '',
                phone: '',
                officeAddress: ''
            }
            this.setState({
                cityInitial: empty,
                city: empty,
                loadStatus: 'complete',
                breadcrumbsLinks: [
                    { url: '/cities', text: 'Офисы' },
                    { url: 'create', text: 'Новый офис' }
                ]
            })
        } else {
            const { nameUrl } = this.props.match.params
            this.getCity(nameUrl)
        }
    }

    componentWillReceiveProps(nextProps){
        if(this.props.match && this.props.match.params){
            const oldNameUrl = this.props.match.params.nameUrl
            const newNameUrl = nextProps.match.params.nameUrl
            if(newNameUrl != oldNameUrl){
                this.getCity(newNameUrl)
            }
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
                        return createCityApi(values)
                        .then(city => {
                            this.setState({ isCreated: true }, () => {
                                message.success(`Офис ${ city.name } создан.`)
                            })
                        })
                    } catch(err) {
                        message.error(`Офис ${city.name} не создан.`)
                        console.log(`ERROR ${ err.stack }`)
                    }
                } else {
                    const { nameUrl } = this.props.match.params
                    try {
                        return editCityApi(nameUrl, values)
                        .then(city => {
                            message.success(`Офис ${ city.name } отредактирован.`)
                        })
                    } catch(err) {
                        message.error(`Офис ${ city.name } не отредактирован.`)
                        console.log(`ERROR ${ err.stack }`)
                    }
                }

            } else {
                console.log(`ERROR ${err.stack}`)
            }
        })
    }

    cancelChanges(){
        this.setAllInputs(this.state.cityInitial)
    }

    setAllInputs(city){
        if(city.name){
            this.onNameChange(city.name)
        }
        if(city.nameUrl){
            this.onNameUrlChange(city.nameUrl)
        }
        if(city.phone){
            this.onPhoneChange(city.phone)
        }
        if(city.officeAddress){
            this.onOfficeAddressChange(city.officeAddress)
        }
    }

    onNameChange(val){
        this.props.form.setFieldsValue({ name: val })
    }
    onNameUrlChange(val){
        this.props.form.setFieldsValue({ nameUrl: val })
    }
    onPhoneChange(val){
        this.props.form.setFieldsValue({ phone: val })
    }
    onOfficeAddressChange(val){
        this.props.form.setFieldsValue({ officeAddress: val })
    }

    render(){
        const {
            city,
            isCreated,
            loadStatus,
            breadcrumbsLinks
        } = this.state
        const { getFieldDecorator, getFieldValue }  = this.props.form
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
                    message='Данного офиса не существует'
                >
                    <Form onSubmit = { e => this.handleSave(e) }>
                        <Col sm={24} md={4}>
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
                            </FormItem>
                        </Col>
                        <Col sm={24} md={20}>
                            <FormItem label='Город' className={ l.formItem }>
                                {getFieldDecorator('name', { rules: [
                                    { required: true, message: 'Обязательное поле' }
                                ] })(
                                    <Input
                                        onChange={ val => this.onNameChange(val) }
                                    />
                                )}
                            </FormItem>

                            <FormItem label='URL'  className={ l.formItem }>
                                {getFieldDecorator('nameUrl', { rules: [
                                    { required: true, message: 'Обязательное поле' }
                                ] })(
                                    <Input
                                        disabled={ this.props.type == 'create' ? false : true}
                                        onChange={ val => this.onNameUrlChange(val) }
                                    />
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

                            <FormItem label='Адрес'  className={ l.formItem }>
                                {getFieldDecorator('officeAddress', { rules: [
                                    { required: true, message: 'Обязательное поле' }
                                ] })(
                                    <Input
                                        onChange={ val => this.onOfficeAddressChange(val) }
                                    />
                                )}
                            </FormItem>
                        </Col>
                    </Form>
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
