import React from 'react'
import { connect } from 'react-redux'
import { string } from 'prop-types'
import moment from 'moment'

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
const { TextArea } = Input
const FormItem = Form.Item
const Icon = require('antd/lib/icon')
require('antd/lib/icon/style/css')
const Spin = require('antd/lib/spin')
require('antd/lib/spin/style/css')
const message = require('antd/lib/message')
require('antd/lib/message/style/css')
const Select = require('antd/lib/select')
require('antd/lib/select/style/css')

import getCookie from 'client/admin/resources/getCookie'
import {
    getOrder as getOrderApi,
    editOrder as editOrderApi
} from 'client/admin/api/orders'
import {
    setOrdersOptions as setOrdersOptionsAction
} from 'client/admin/actions/ordersOptions'

import config from 'config/client'
import DateInput from 'client/site/components/content/OrderForm/formItems/DateInput/DateInput.jsx'
import TimeInput from 'client/site/components/content/OrderForm/formItems/TimeInput/TimeInput.jsx'
//import Description from 'client/site/components/content/OrderForm/formItems/Description/Description.jsx'

import l from './Edit.less'

class Edit extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            isWorkerSelected:   false,
            orderInitial:       null,
            order:              null,
        }
    }

    initialOrder(cityNameUrl, dateString, id){
        try {
            getOrderApi(cityNameUrl, dateString, id)
            .then(order => {
                console.log('get Order', order)
                const dateFromUrl = new Date(dateString)
                
                this.setState({
                    orderInitial: order,
                    order:        order,
                }, () => {                    
                    this.setAllInputs(this.state.order)
                })
            })
        } catch(err) {
            console.log(`ERROR ${err.stack}`)
        }
    }

    componentDidMount(){
        const { dateString, id } = this.props.match.params
        this.userCityNameUrl = getCookie('userCityNameUrl')
        this.initialOrder(this.userCityNameUrl, dateString, id)  
        this.props.setOrdersOptionsAction({ 
            cityNameUrl: this.userCityNameUrl 
            })

    }

    componentWillReceiveProps(nextProps){
        const oldDateString = this.props.match.params.dateString
        const newDateString = nextProps.match.params.dateString
        const oldId         = this.props.match.params.id
        const newId         = nextProps.match.params.id

        console.log(`${oldDateString} и ${newDateString}  |  ${oldId} и ${newId}`)

        if(newDateString != oldDateString || newId != oldId){
            this.setState({
                orderInitial: null,
                order: null,
            }, () => {
                this.initialOrder(this.userCityNameUrl, newDateString, newId)  
            })
        }
    }

    handleSave(e){        
        e.preventDefault()
        this.props.form.validateFields((err, values) => {
            if (!err) {
                console.log('VALUES ', values)
            }
        })
    }

    setAllInputs(order){
        if(order.date){
            this.onDateChange(order.date)
        }
        if(order.time){
            this.onTimeChange(order.time)
        }
        if(order.description){
            this.onDescriptionChange(order.description)
        }
        if(order.address){
            this.onAddressChange(order.address)
        }
        if(order.apartment){
            this.onApartmentChange(order.apartment)
        }
        if(order.phone){
            this.onPhoneChange(order.phone)
        }
        if(order.name){
            this.onNameChange(order.name)
        }
        if(order.worker){
            this.onWorkerSelect(order.worker)
        }
        if(order.status){
            this.onStatusSelect(order.status)
        }
    }

    onDateChange(val){
        const { getFieldDecorator, getFieldValue } = this.props.form
        this.props.form.setFieldsValue({ date: val })
        
        const date = new Date(val)
        const dateToView = date.toLocaleDateString('ru-RU', config.date.dateViewOptions)
        getFieldDecorator('dateToView',   { initialValue: dateToView })
        
        const dateToLink = moment(date).format(config.date.dateLinkFormat)
        getFieldDecorator('dateToLink',   { initialValue: dateToLink })

    }
    onTimeChange(val){
        //this.props.form.getFieldDecorator('time',   { initialValue: val })
        this.props.form.setFieldsValue({ time: val })
    }
    onDescriptionChange(val){
        this.props.form.setFieldsValue({ description: val })
    }
    onAddressChange(val){
        this.props.form.setFieldsValue({ address: val })
    }    
    onApartmentChange(val){
        this.props.form.setFieldsValue({ apartment: val })
    }
    onPhoneChange(val){
        this.props.form.setFieldsValue({ phone: val })
    }
    onNameChange(val){
        this.props.form.setFieldsValue({ name: val })
    }
    onWorkerSelect(_id){

    }
    onStatusSelect(val){

    }

    render(){
        const { getFieldDecorator }  = this.props.form
        const { order, isWorkerSelected } = this.state
        const { dateString, id } = this.props.match.params
        const dateFromUrl = new Date(dateString)

        if(order){
            return (
                <Row className={ l.root }>
                    <Form onSubmit = { e => this.handleSave(e) }>
                        <Col sm={24} md={4}>
                            <FormItem>
                                { !isWorkerSelected &&
                                    <Button
                                        type='primary'
                                        htmlType='submit'
                                    >Сохранить</Button>
                                }                    
                            </FormItem>
                        </Col>
                        <Col sm={24} md={20}>
                            
                            <FormItem 
                                label='Когда нужен мастер' 
                                className={ l.inline }
                                key={ order.dateToLink }
                            >
                                {getFieldDecorator('date', { rules: [
                                    { required: true, message: 'Обязательное поле' }
                                ] })(
                                    <DateInput
                                        onDataToForm={ date => this.onDateChange(date) }
                                        disablePrevDates={ true }
                                        defaultDate={ moment(dateFromUrl) }
                                    /> 
                                )}
                            </FormItem>
                            
                            <FormItem 
                                label='В какое время' 
                                className={ l.inline } 
                                key={ order.time }
                            >
                                {getFieldDecorator('time', { rules: [
                                    { required: true, message: 'Обязательное поле' }
                                ] })(
                                    <TimeInput 
                                        onDataToForm={ val => this.onTimeChange(val) } 
                                        defaultValue={ order.time ? parseInt(order.time) : null }
                                    />
                                )}
                            </FormItem>
                            
                            <div className={ l.textItem }>
                                <label>Категория: </label>
                                <span>{ order.categoryShortName }</span>
                            </div>
                            
                            { 
                                order.firm &&
                                <div className={ l.textItem }>
                                    <label>Фирма производитель: </label>
                                    <span>{ order.firm }</span>
                                </div>
                            }    

                            { 
                                order.howOld &&
                                <div className={ l.textItem }>
                                    <label>Лет технике: </label>
                                    <span>{ order.howOld }</span>
                                </div>
                            }     

                            { 
                                (order.problems && order.problems.length) 
                                ?
                                <div className={ l.textItem }>
                                    <label>Неисправности: </label>
                                    <ul>
                                    {
                                        order.problems.map(problem => (
                                            <li key={ Math.random() }>{ problem }</li>
                                        ))
                                    }   
                                    </ul>                                 
                                </div>
                                : null
                            }                       
                            {        
                                order.description &&
                                <FormItem label='Описание проблемы:'>
                                    {getFieldDecorator('description', { rules: [] })(                                        
                                        <TextArea 
                                            rows={4}
                                            onChange={ e => this.onDescriptionChange(e.target.value) }
                                        />
                                    )}
                                </FormItem>
                            }

                            <FormItem label='Адрес'>
                                {getFieldDecorator('address', { rules: [
                                    { required: true, message: 'Обязательное поле' }
                                ] })(
                                    <Input 
                                        onChange={ val => this.onAddressChange(val) }
                                    />
                                )}
                            </FormItem>

                            <FormItem label='Квартира'>
                                {getFieldDecorator('apartment', { rules: [] })(
                                    <Input 
                                        onChange={ val => this.onApartmentChange(val) }
                                    />
                                )}
                            </FormItem>

                            <FormItem label='Телефон'>
                                {getFieldDecorator('phone', { rules: [
                                    { required: true, message: 'Обязательное поле' }
                                ] })(
                                    <Input 
                                        onChange={ val => this.onPhoneChange(val) }
                                    />
                                )}
                            </FormItem>

                            <FormItem label='Имя'>
                                {getFieldDecorator('name', { rules: [
                                    { required: true, message: 'Обязательное поле' }
                                ] })(
                                    <Input 
                                        onChange={ val => this.onNameChange(val) }
                                    />
                                )}
                            </FormItem>
                            
                        </Col>
                    </Form>
                </Row>
            )
        } else return null      
    }
}

const mapStateToProps = state => ({})

const mapDispatchToProps = {
    setOrdersOptionsAction
}

const EditForm = Form.create()(Edit)
//export default EditForm
export default connect(mapStateToProps, mapDispatchToProps)(EditForm)