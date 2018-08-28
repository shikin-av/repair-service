import React from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import moment from 'moment'
import _ from 'lodash'

const Form = require('antd/lib/form')
require('antd/lib/form/style/css')
const FormItem = Form.Item
const Button = require('antd/lib/button')
require('antd/lib/button/style/css')
const Spin = require('antd/lib/spin')
require('antd/lib/spin/style/css')
const Select = require('antd/lib/select')
require('antd/lib/select/style/css')
const Option = Select.Option
const Input = require('antd/lib/input')
require('antd/lib/input/style/css')
const Icon = require('antd/lib/icon')
require('antd/lib/icon/style/css')

import {
    setOrdersOptions as setOrdersOptionsAction
} from 'client/admin/actions/ordersOptions'
import {
    getUsersByCityDays as getUsersByCityDaysApi
} from 'client/admin/api/users'

import DateInput from 'client/site/components/content/OrderForm/formItems/DateInput/DateInput.jsx'
import config from 'config/client'
import device from 'current-device'

class OrderFilter extends React.Component {
    constructor(props){
        super(props)        
        this.statuses = [
            { value: 'all',      text: 'Все заявки' },
            { value: 'new',      text: 'Новые' },
            { value: 'working',  text: 'В работе' },
            { value: 'complete', text: 'Завершены' },
            { value: 'trash',    text: 'Удалены' },
        ]
        this.state = {
            currentStatus: { value: 'all',      text: 'Все заявки' },
            workers: null,
            selectedWorker: null,
            visible: true
        }
    }

    componentWillMount(){
        this.isMobile = device.mobile()
        if(this.isMobile){
            this.setState({ visible: false })
        }
    }

    componentDidMount(){
        const { setFieldsValue } = this.props.form
        const { 
            cityNameUrl, 
            dateString, 
            status, 
            id,
            workerLogin
        } = this.props   

        if(status){
            this.onStatusSelect(status)
        } else {
            this.onStatusSelect('all')
        }
        if(id){
            this.onIdChange(id)   
        }  

        this.getWorkersByDay()
        .then(workers => {
            if(!workers.error){
                this.setState({ 
                    workers: [{ 
                        login: null, 
                        fio: 'Все работники' 
                    }, ...workers]
                }, () => {
                    this.onWorkerSelect(workerLogin)
                })
            }    
        })                
    }

    handleSubmit(e){
        const { cityNameUrl, setOrdersOptionsAction } = this.props
        e.preventDefault()
        this.props.form.validateFields((err, values) => {
            if (!err) {                
                let link = `/admin#/orders/date/${ values.dateString }`
                let ordersOptions = {
                    cityNameUrl: cityNameUrl,
                    dateToLink: values.dateString
                }

                if(values.status){                    
                    link += `/status/${ values.status }`
                    if(values.status != 'all'){                        
                        ordersOptions.status = values.status    
                    }                    
                } else {
                    link += `/status/all`
                }
                if(values.workerLogin){
                    link += `/worker/${ values.workerLogin }`   
                }
                
                if(values.id){
                    link = `/admin#/orders/serch-id/${ values.id }`
                    ordersOptions.id = values.id
                }

                setOrdersOptionsAction(ordersOptions).then(() => {
                    window.location.replace(link)
                })              
            }
        })
    }

    getWorkersByDay(){
        const { cityNameUrl } = this.props
        const { getFieldValue } = this.props.form
        const cyrilicDay = moment(getFieldValue('dateString')).format('dddd')
        return getUsersByCityDaysApi(cityNameUrl, cyrilicDay)
        .then(users => {
            if(!users.error){
                return users
            } else return []
        })
    }

    onDateChange(date){
        const { setFieldsValue } = this.props.form
        const dateString = moment(date).format(config.date.dateLinkFormat)
        setFieldsValue({ dateString: dateString })
    }

    onStatusSelect(val){
        const { setFieldsValue } = this.props.form
        const statusObj = this.statuses[_.findIndex(this.statuses, item => {
            return item.value == val
        })]
        this.setState({
            currentStatus: statusObj
        }, () => {
            setFieldsValue({ status: val })
        })        
    }

    onIdChange(val){
        const { setFieldsValue } = this.props.form
        setFieldsValue({ id: val })
    }

    onWorkerSelect(val){
        const { setFieldsValue } = this.props.form
        const { workers } = this.state

        let selectedWorker = null
        if(workers){
            selectedWorker = workers[_.findIndex(workers, worker => {
                return worker.login == val
            })]
            this.setState({ selectedWorker }, () => {
                if(selectedWorker && selectedWorker.login){
                    setFieldsValue({ workerLogin: selectedWorker.login })    
                }
            })
        }        
    }

    visibleChange(){
        const { visible } = this.state
        this.setState({ visible: !visible })
    }

    render(){
        const { dateString } = this.props
        const { getFieldDecorator }  = this.props.form
        const { 
            currentStatus,
            workers,
            selectedWorker,
            visible,
        } = this.state
        
        const today = moment().add(0, 'day')
        let currentDate = today
        if(dateString){
            const dateFromUrl = new Date(dateString)
            if(dateFromUrl != 'Invalid Date'){
                currentDate = moment(dateFromUrl)
            }
        }
        return(            
            <div>
                {
                    this.isMobile &&                    
                    <Button onClick={ () => this.visibleChange() } >
                        {
                            visible 
                            ? <span><Icon type='up'/> Закрыть фильтр</span>
                            : <span><Icon type='down'/> Открыть фильтр</span>
                        }
                        
                    </Button>
                    
                }
                <Form 
                    onSubmit = { e => this.handleSubmit(e) }
                    style={ visible ? { display: 'block'} : { display: 'none' } }
                >
                    <FormItem className='inline'>
                        {getFieldDecorator('dateString', { rules: [] })(
                            <DateInput
                                onDataToForm={ date => this.onDateChange(date) }
                                defaultDate={ currentDate }
                            />
                        )}
                    </FormItem>
                    
                    <FormItem className='inline' key={ currentStatus.value }>
                        {getFieldDecorator('status', { rules: [] })(
                            <Select 
                                defaultValue={ currentStatus.value }
                                onChange={ val => this.onStatusSelect(val) }
                                style={{ width: 150 }}
                                placeholder='Статус заявки'                 
                            >
                            {
                                this.statuses.map(status => (
                                    <Option
                                        value={ status.value }
                                        key={ status.value }
                                    >{ status.text }</Option>
                                ))
                            }
                            </Select>
                        )}
                    </FormItem>
                    {
                        workers &&
                        <FormItem className='inline' key={ 
                            (selectedWorker && selectedWorker.hasOwnProperty('login')) 
                            ? selectedWorker.login : Math.random()
                        }>
                            {getFieldDecorator('workerLogin', { rules: [] })(
                                <Select 
                                    defaultValue={ 
                                        (selectedWorker && selectedWorker.hasOwnProperty('login'))
                                        ? selectedWorker.login : null
                                    }
                                    onChange={ val => this.onWorkerSelect(val) }
                                    style={{ width: 150 }}
                                    placeholder='Работник'                 
                                >
                                {
                                    workers.map(worker => (
                                        <Option
                                            value={ worker.login }
                                            key={ worker.login }
                                        >{ worker.fio }</Option>
                                    ))
                                }
                                </Select>
                            )}
                        </FormItem>
                    }
                    
                    <FormItem className='inline'>
                        {getFieldDecorator('id', { rules: [] })(
                            <Input
                                onChange={ e => this.onIdChange(e.target.value) }
                                addonBefore='Заявка №'
                                style={{ maxWidth: 140 }}
                            />
                        )}
                    </FormItem>

                    <FormItem className='inline'>
                        <Button
                            type='primary'
                            htmlType='submit'
                        >Применить фильтр</Button>
                    </FormItem>
                </Form>
            </div>
        )
    }
}

const mapStateToProps = state => ({})

const mapDispatchToProps = {
    setOrdersOptionsAction
}

const OrderFilterForm = Form.create()(OrderFilter)

export default connect(mapStateToProps, mapDispatchToProps)(OrderFilterForm)
