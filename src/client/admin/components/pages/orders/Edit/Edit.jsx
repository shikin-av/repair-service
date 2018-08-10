import React from 'react'
import { connect } from 'react-redux'
import { string } from 'prop-types'
import moment from 'moment'
import _ from 'lodash'

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
const Alert = require('antd/lib/alert')
require('antd/lib/alert/style/css')

import getCookie from 'client/admin/resources/getCookie'
import {
    getOrder as getOrderApi,
    editOrder as editOrderApi
} from 'client/admin/api/orders'
import {
    getUsersByCityCategoryDays as getUsersByCityCategoryDaysApi
} from 'client/admin/api/users'
import {
    setOrdersOptions as setOrdersOptionsAction
} from 'client/admin/actions/ordersOptions'

import config from 'config/client'
import DateInput from 'client/site/components/content/OrderForm/formItems/DateInput/DateInput.jsx'
import TimeInput from 'client/site/components/content/OrderForm/formItems/TimeInput/TimeInput.jsx'
import BreadcrumbsPanel from 'client/admin/components/content/BreadcrumbsPanel/BreadcrumbsPanel.jsx'
import Radio from 'client/site/components/content/Radio/Radio.jsx'

import l from 'client/admin/components/style/Edit.less'

class Edit extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            isWorkerSelected:   false,
            orderInitial:       null,
            order:              null,
            workers:            [],
            categoryNameUrl:    null,
            cyrilicDay:         null,
            status:             null
        }
        this.userCityNameUrl = null
    }

    componentWillMount(){
        moment.locale('ru')   
    }

    initialOrder(cityNameUrl, dateString, id){
        const { getFieldValue } = this.props.form
        try {
            getOrderApi(cityNameUrl, dateString, id)
            .then(order => {
                //console.log('get Order', order)
                const dateFromUrl = new Date(dateString)
                
                this.setState({
                    orderInitial:     order,
                    order:            order,
                    categoryNameUrl:  order.categoryNameUrl,
                    cyrilicDay:       moment(getFieldValue('date')).format('dddd'),
                    isWorkerSelected: order.worker ? true : false,
                    status:           order.status
                }, () => {
                    this.workersLoad(cityNameUrl, this.state.categoryNameUrl, this.state.cyrilicDay)
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

        //console.log(`${oldDateString} и ${newDateString}  |  ${oldId} и ${newId}`)

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
        const { getFieldValue, setFieldsValue } = this.props.form   
        e.preventDefault()
        this.props.form.validateFields((err, values) => {
            if (!err) {
                //console.log('VALUES ', values)
                try {
                    //TODO 
                    if(getFieldValue('worker')){
                        this.setState({
                            isWorkerSelected: true,
                            status:           values.status,
                        }, () => {
                            if(this.state.isWorkerSelected){
                                if(this.state.status == 'new'){
                                    this.setState({ status: 'working' }, () => {                                        
                                        setFieldsValue({ status: 'working' })   
                                        values.status = this.state.status
                                        console.log('VALUES ', values)
                                    })
                                }
                            } else {
                                values.status = this.state.status
                                console.log('VALUES ', values)
                            }
                        })    
                    } else {
                        if(values.status == 'trash'){
                            this.setState({ status: values.status })
                            console.log('VALUES ', values)
                        }
                    }      
                } catch(err) {
                    message.error('Изменения не сохранены.')
                    console.log(`ERROR ${err.stack}`)
                }
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
        const { getFieldDecorator, getFieldValue, setFieldsValue } = this.props.form
        setFieldsValue({ date: val })
        
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
        this.props.form.setFieldsValue({ worker: _id })
    }
    onStatusSelect(val){
        this.props.form.setFieldsValue({ status: val })
    }

    workersLoad(cityNameUrl, categoryNameUrl, cyrilicDay){
        try {
            const workers = getUsersByCityCategoryDaysApi(cityNameUrl, categoryNameUrl, cyrilicDay)
            .then(workers => {
                console.log('workers',workers)  
                this.setState({ workers: workers }, () => {
                    this.setAllInputs(this.state.order)        
                })                            
            })
        } catch(err) {
            message.error(`Работники не загружены.`)
            console.log(`ERROR ${err.stack}`)
        }
    }

    getSelectedWorker(){
        const { getFieldValue }  = this.props.form
        const { order, workers } = this.state
        const selectedWorkerId = getFieldValue('worker')

            const selectedWorker = _.filter(workers, worker => {                
                return worker._id == selectedWorkerId || worker._id == order.worker
            })
            console.log('selectedWorker',selectedWorker[0])
        return selectedWorker[0]
    }

    renderWorkersSelect(workers){
        const { getFieldDecorator, getFieldValue }  = this.props.form
        const { isWorkerSelected, order } = this.state   
        let element = null
        const isTrashStatus = getFieldValue('status') == 'trash'
        if(!isWorkerSelected){
            if(workers && workers.length){
                element = (
                    <Select onChange={ val => this.onWorkerSelect(val) }>
                    {   
                        workers.map(worker => (
                            <Option
                                value={ worker._id }
                                key={ worker._id }
                            >{ worker.fio }</Option>
                        ))
                    }
                    </Select>
                )
            } else {
                element = ( <span></span> )
            }
        } else {
            const selectedWorker = this.getSelectedWorker()
            element = (
                <div className={ l.textItem }>
                    <label>Работник: </label>
                    <span>{ selectedWorker.fio }</span>
                </div>
            )
        }   
        return (
            <FormItem label='Выберите работника' className={ l.formItem }>
                {getFieldDecorator('worker', { rules: [
                    { 
                        required: !isTrashStatus, 
                        message: 'Обязательное поле' 
                    }
                ] })(
                    element
                )}
            </FormItem>
        )     
    }    

    renderStatusRadio(){
        const { isWorkerSelected, order, status } = this.state
        const { getFieldDecorator, getFieldValue }  = this.props.form
        let statuses = [
            { value: 'new',      text: 'Новая' },
            { value: 'working',  text: 'В работе' },
            { value: 'complete', text: 'Завершена' },
            { value: 'trash',    text: 'Удалена' },
        ]
        if(status == 'trash'){
            getFieldDecorator('status',   { initialValue: 'trash' })
            return (
                <Alert  
                    type='warning'
                    message='Заявка Удалена'
                />
            )
        }
        if(isWorkerSelected){
            if(status == 'working'){
                statuses = [
                    { value: 'working',  text: 'В работе' },
                    { value: 'complete', text: 'Завершена' },                                     
                ]
            } else if(status == 'complete'){
                getFieldDecorator('status',   { initialValue: 'complete' })
                return (
                    <Alert  
                        type='success'
                        message='Заявка Выполнена'
                    />
                )
            } 
        }
        return (
            <FormItem label='Статус заявки' className={ l.formItem }>
                {getFieldDecorator('status', { rules: [
                    { required: true, message: 'Обязательное поле' }
                ] })(
                    <Radio 
                        name='howOld'
                        items = { statuses }
                        onData={ val => this.onStatusSelect(val) }
                        style='inline'
                        defaultChecked={ order.status }
                    />
                )}
            </FormItem>
        )
    }

    renderFormSubmit(isWorkerSelected, status){
        const { getFieldValue } = this.props.form
        const selectedWorker = this.getSelectedWorker()

        console.log('renderFormSubmit STATUS', status)
        console.log('renderFormSubmit isWorkerSelected', isWorkerSelected)
        console.log('renderFormSubmit selectedWorker', selectedWorker)

        //todo
        if(status == 'trash'){
            return (
                <Alert  
                    type='warning'
                    message='Заявка Удалена'
                />
            )
        } else if(getFieldValue('status') == 'trash'){
            return (
                <Button
                    type='primary'
                    htmlType='submit'
                >Удалить заявку</Button>
            )
        }
        if(!isWorkerSelected){
            if(!selectedWorker){
                return (
                    <Alert 
                        type='warning' 
                        message='Выберите работника' 
                    />
                ) 
            } else if(selectedWorker){
                return (
                    <FormItem>
                        <Button
                            type='primary'
                            htmlType='submit'
                        >{ `Отправить смс с данными заказа работнику ${ selectedWorker.fio }` }</Button>
                    </FormItem>
                )
            }
        } else if(isWorkerSelected && selectedWorker){
            if(status == 'working'){
                return (
                    <div>
                        <Button
                            type='primary'
                            htmlType='submit'
                        >Сохранить заявку</Button>
                        <Alert 
                            type='info'
                            message={ `Заявка в работе: ${ selectedWorker.fio }` }
                        />
                    </div>
                )
            } else if(status == 'complete'){
                return (
                    <Alert  
                        type='success'
                        message={ `Заявка Выполнена: ${ selectedWorker.fio }` }
                    />
                )
            }
        }
    }    

    render(){
        const { getFieldDecorator }  = this.props.form
        const { 
            order, 
            isWorkerSelected, 
            workers, 
            status 
        } = this.state
        const { dateString, id } = this.props.match.params
        const dateFromUrl = new Date(dateString)        
        const dateToView = dateFromUrl.toLocaleDateString('ru-RU', config.date.dateViewOptions)
        const breadcrumbsLinks = [
            { url: '/orders', text:'Заявки' },
            { url: `/orders/date/${ dateString }`, text: dateToView },
            { url: `/orders/date/${ dateString }/id/${ id }`, text: `№${ id }` },
        ]
        if(order){
            return (
                <Row className={ l.root }>
                    <BreadcrumbsPanel
                        history={ this.props.history }
                        backButton={ true }
                        links={ breadcrumbsLinks }
                    />
                    <Form onSubmit = { e => this.handleSave(e) }>                        
                            { this.renderFormSubmit(isWorkerSelected, status) }
                                                    
                            <FormItem 
                                label='Когда нужен мастер'
                                className={ `${ l.formItem } ${ l.inline }` }
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
                                className={ `${ l.formItem } ${ l.inline }` }
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
                                <FormItem label='Описание проблемы:' className={ l.formItem }>
                                    {getFieldDecorator('description', { rules: [] })(                                        
                                        <TextArea 
                                            rows={4}
                                            onChange={ e => this.onDescriptionChange(e.target.value) }
                                        />
                                    )}
                                </FormItem>
                            }

                            <FormItem label='Адрес' className={ l.formItem }>
                                {getFieldDecorator('address', { rules: [
                                    { required: true, message: 'Обязательное поле' }
                                ] })(
                                    <Input 
                                        onChange={ val => this.onAddressChange(val) }
                                    />
                                )}
                            </FormItem>

                            <FormItem label='Квартира' className={ l.formItem }>
                                {getFieldDecorator('apartment', { rules: [] })(
                                    <Input 
                                        onChange={ val => this.onApartmentChange(val) }
                                    />
                                )}
                            </FormItem>

                            <FormItem label='Телефон' className={ l.formItem }>
                                {getFieldDecorator('phone', { rules: [
                                    { required: true, message: 'Обязательное поле' }
                                ] })(
                                    <Input 
                                        onChange={ val => this.onPhoneChange(val) }
                                    />
                                )}
                            </FormItem>

                            <FormItem label='Имя' className={ l.formItem }>
                                {getFieldDecorator('name', { rules: [
                                    { required: true, message: 'Обязательное поле' }
                                ] })(
                                    <Input 
                                        onChange={ val => this.onNameChange(val) }
                                    />
                                )}
                            </FormItem>
                            <div key={ status }>
                                { this.renderWorkersSelect(workers) }
                                { this.renderStatusRadio() }
                            </div>
                        
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

export default connect(mapStateToProps, mapDispatchToProps)(EditForm)