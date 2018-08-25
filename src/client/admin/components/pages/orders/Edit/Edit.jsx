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
import LoadedContentView from 'client/admin/components/content/LoadedContentView/LoadedContentView.jsx'

import l from 'client/admin/components/style/Edit.less'

class Edit extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            order:                   null,
            workers:                 [],
            selectedWorker:          null,
            categoryNameUrl:         null,
            cyrilicDay:              null,
            status:                  null,
            smsStatus:               null,
            loadStatus:              'load',
            breadcrumbsLinks:        [{ url: '/orders', text:'Заявки' }],
            title: null
        }
        this.userCityNameUrl = null
    }

    componentDidMount(){
        const { dateString, id } = this.props.match.params
        const { getFieldDecorator } = this.props.form
        this.userCityNameUrl = getCookie('userCityNameUrl')

        getFieldDecorator('worker',   { initialValue: null })
        getFieldDecorator('workerId',   { initialValue: null })
        getFieldDecorator('status',   { initialValue: null })

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

        if(newDateString != oldDateString || newId != oldId){
            this.setState({
                order: null,
            }, () => {
                this.initialOrder(this.userCityNameUrl, newDateString, newId)  
            })
        }
    }

    emptyOrder(){
        this.setState({
            loadStatus: 'empty',
            breadcrumbsLinks: [
                { url: '/orders', text:'Заявки' }
            ]
        })
    }

    initialOrder(cityNameUrl, dateString, id){
        const { getFieldValue } = this.props.form
        try {
            getOrderApi(cityNameUrl, dateString, id)
            .then(order => {
                if(!order.error){
                    const dateFromUrl = new Date(dateString)
                    const dateToView = dateFromUrl.toLocaleDateString('ru-RU', config.date.dateViewOptions)                
                    this.setState({
                        order:                   order,
                        categoryNameUrl:         order.categoryNameUrl,
                        cyrilicDay:              moment(getFieldValue('date')).format('dddd'),
                        status:                  order.status,
                        smsStatus:               order.smsStatus,
                        selectedWorker:          null,
                        loadStatus:              'complete',
                        breadcrumbsLinks:       [
                            { url: '/orders', text:'Заявки' },
                            { url: `/orders/date/${ dateString }`, text: dateToView },
                            { url: `/orders/date/${ dateString }/id/${ id }`, text: `№${ id }` },
                        ],
                        title: `Заявка №${ id }`
                    }, () => {
                        const { order, categoryNameUrl, cyrilicDay } = this.state
                        this.setAllInputs(this.state.order)
                        getUsersByCityCategoryDaysApi(cityNameUrl, categoryNameUrl, cyrilicDay)
                        .then(workers => {
                            if(!workers.error){
                                this.setState({ workers }, () =>{
                                    if(order.workerId){
                                        this.onWorkerSelect(order.workerId)
                                    }
                                })    
                            }                            
                        })
                    })
                } else {
                    this.emptyOrder()
                }                
            })
        } catch(err) {
            this.emptyOrder()
        }
    }
    

    handleSubmit(e){     
        const { getFieldValue, setFieldsValue } = this.props.form
        const { dateString, id } = this.props.match.params 
        const { order, selectedWorker } = this.state
        e.preventDefault()
        this.props.form.validateFields((err, values) => {
            if (!err) {
                const initialStatus = order.status
                if(!order.workerId && values.worker){
                    if(values.status == 'new'){
                        values.status = 'working'
                    }
                }
                if(!this.userCityNameUrl){
                    this.userCityNameUrl = getCookie('userCityNameUrl')
                }                
                try {
                    editOrderApi(this.userCityNameUrl, dateString, id, values)
                    .then(editedOrder => {
                        if(!editedOrder.error){
                            this.setState({
                                order:     editedOrder,
                                status:    editedOrder.status,
                                smsStatus: editedOrder.smsStatus,
                            }, () => {
                                setFieldsValue({ status: values.status })
                                if(initialStatus == 'new'){
                                    if(editedOrder.smsStatus == 'sended'){
                                        message.success('Изменения сохранены.')
                                        message.success(`Смс отправлена работнику ${ selectedWorker.fio }.`)
                                    } else if(editedOrder.smsError){
                                        message.error('Изменения не сохранены.')
                                        message.error(editedOrder.smsError)
                                    }
                                } else {
                                    message.success('Изменения сохранены.')
                                }
                            })
                        } else {
                            message.error('Изменения не сохранены.')
                        }                        
                    })  
                } catch(err) {
                    message.error('Изменения не сохранены.')
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
        if(order.workerId){
            this.onWorkerSelect(order.workerId)
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
        const { setFieldsValue, getFieldValue, getFieldDecorator } = this.props.form
        const { order, workers } = this.state
        const selectedWorker = workers[_.findIndex(workers, worker => {                
            return worker._id == _id || worker._id == order.workerId
        })]
        if(selectedWorker){
            this.setState({ selectedWorker }, () => {
                setFieldsValue({ 
                    worker: selectedWorker,
                    workerId: _id 
                })
            })
        } else if(order.workerFio){ // worker deleted from db
            this.setState({ 
                selectedWorker: { 
                    fio: order.workerFio,
                    phone: '',
                    _id: 'empty'
                } 
            }, () => {
                setFieldsValue({ worker: this.state.selectedWorker })
                setFieldsValue({ workerId: 'empty' })
            })
        }
    }
    onStatusSelect(val){
        this.setState({ status: val }, () => {
            this.props.form.setFieldsValue({ status: val })    
        })        
    }

    renderWorkersSelect(order, workers, selectedWorker){
        const { status } = this.state
        const { getFieldDecorator }  = this.props.form
        let element = ( <span></span> )
        if(workers){            
            if(order.workerId && selectedWorker){
                element = (
                    <span>{ selectedWorker.fio }</span>
                )
            } else {
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
            }
        }
        return (
            <FormItem 
                label={ !order.workerId ? 'Выберите работника' : 'Работник' } 
                className={ l.formItem }>
                {getFieldDecorator('workerId', { rules: [
                    { 
                        required: status != 'trash', 
                        message: 'Обязательное поле' 
                    }
                ] })( element )}
            </FormItem>
        )
    }

    renderStatusRadio(order){
        const { getFieldDecorator } = this.props.form
        let statuses = [
            { value: 'new',      text: 'Новая' },
            { value: 'working',  text: 'В работе' },
            { value: 'complete', text: 'Завершена' },
            { value: 'trash',    text: 'Удалена' },
        ]
        if(order.status == 'trash'){
            getFieldDecorator('status',   { initialValue: 'trash' })
            return (
                <Alert  
                    type='warning'
                    message='Заявка Удалена'
                />
            )
        }
        if(order.workerId){
            if(order.status == 'working'){
                statuses = [
                    { value: 'working',  text: 'В работе' },
                    { value: 'complete', text: 'Завершена' },
                ]
            } else if(order.status == 'complete'){
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

    renderFormSubmit(order, selectedWorker, status, smsStatus){
        if(order.status == 'trash'){
            return (
                <Alert  
                    type='warning'
                    message='Заявка Удалена'
                />
            )
        }
        if(order.status == 'new' && status == 'trash'){
            return (
                <FormItem>
                    <Button
                        type='primary'
                        htmlType='submit'
                    >Удалить заявку</Button>
                </FormItem>
            )
        }
        if(!selectedWorker){
            return (
                <Alert 
                    type='warning' 
                    message='Выберите работника' 
                />
            )
        }
        if(selectedWorker){
            if(order.status == 'new'){
                if(status == 'new' || status == 'working'){
                    if(smsStatus != 'sended'){
                        return (
                            <FormItem>
                                <Button
                                    type='primary'
                                    htmlType='submit'
                                >{ `Отправить смс с данными заказа работнику ${ selectedWorker.fio }` }</Button>
                            </FormItem>
                        )
                    }
                }
            } else if(order.status == 'working'){
                return (
                    <FormItem>
                        <Button
                            type='primary'
                            htmlType='submit'
                        >Сохранить заявку</Button>
                        <Alert 
                            type='info'
                            message={ `Заявка в работе: ${ selectedWorker.fio }: ${ selectedWorker.phone }` }
                        />
                    </FormItem>
                )
            } else if(order.status == 'complete'){
                return (
                    <Alert  
                        type='success'
                        message={ `Заявка Выполнена: ${ selectedWorker.fio }: ${ selectedWorker.phone }` }
                    />
                )
            }
        }
    }


    render(){
        const { getFieldDecorator }  = this.props.form
        const { 
            order,             
            workers,
            selectedWorker, 
            status,
            smsStatus,
            loadStatus,
            breadcrumbsLinks,
            title,
        } = this.state
        const { dateString, id } = this.props.match.params
        const dateFromUrl = new Date(dateString)
        
        return (
            <Row className={ l.root }>
                <BreadcrumbsPanel
                    history={ this.props.history }
                    backButton={ true }
                    links={ breadcrumbsLinks }
                />
                <LoadedContentView
                    loadStatus={ loadStatus }
                    message='Данной заявки не существует'
                >
                <h1>{ title }</h1>
                {   order ?
                    <Form onSubmit = { e => this.handleSubmit(e) }>                        
                        
                        { this.renderFormSubmit(order, selectedWorker, status, smsStatus) }
                                                
                        <FormItem 
                            label='Когда нужен мастер'
                            className={ `${ l.formItem } ${ l.inline }` }
                            key={ order.dateToLink }
                        >
                            {getFieldDecorator('date', { rules: [
                                { 
                                    required: status != 'trash', 
                                    message: 'Обязательное поле' 
                                }
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
                                { 
                                    required: status != 'trash', 
                                    message: 'Обязательное поле' 
                                }
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
                                    order.problems.map((problem, id) => (
                                        <li key={ id }>{ problem }</li>
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
                                { 
                                    required: status != 'trash', 
                                    message: 'Обязательное поле' 
                                }
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
                                { 
                                    required: status != 'trash', 
                                    message: 'Обязательное поле' 
                                }
                            ] })(
                                <Input 
                                    onChange={ val => this.onPhoneChange(val) }
                                />
                            )}
                        </FormItem>

                        <FormItem label='Имя' className={ l.formItem }>
                            {getFieldDecorator('name', { rules: [
                                { 
                                    required: status != 'trash', 
                                    message: 'Обязательное поле' 
                                }
                            ] })(
                                <Input 
                                    onChange={ val => this.onNameChange(val) }
                                />
                            )}
                        </FormItem>

                        { this.renderWorkersSelect(order, workers, selectedWorker) }                        
                        { this.renderStatusRadio(order) }
                    </Form>
                    : <span></span>
                }
                </LoadedContentView>
            </Row>
        )           
    }
}

const mapStateToProps = state => ({})

const mapDispatchToProps = {
    setOrdersOptionsAction
}

const EditForm = Form.create()(Edit)

export default connect(mapStateToProps, mapDispatchToProps)(EditForm)