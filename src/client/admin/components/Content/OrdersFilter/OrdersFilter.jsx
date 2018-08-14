import React from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import moment from 'moment'

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

/*import {
    getOrdersOptions as getOrdersOptionsSelector
} from 'client/admin/selectors/ordersOptions'
*/
import {
    setOrdersOptions as setOrdersOptionsAction
} from 'client/admin/actions/ordersOptions'

import DateInput from 'client/site/components/content/OrderForm/formItems/DateInput/DateInput.jsx'
import config from 'config/client'

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
    }

    handleSubmit(e){
        const { cityNameUrl, setOrdersOptionsAction } = this.props
        e.preventDefault()
        this.props.form.validateFields((err, values) => {
            if (!err) {
                console.log('Filter values ', values)
                
                let link = `/admin#/orders/date/${ values.dateString }`
                let ordersOptions = {
                    cityNameUrl: cityNameUrl,
                    dateToLink: values.dateString
                }

                if(values.status){
                    link += `/status/${ values.status }`
                    ordersOptions.status = values.status
                } else {
                    link += `/status/all`
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

    componentDidMount(){
        const { setFieldsValue } = this.props.form
        const { cityNameUrl, dateString, status, id } = this.props        
        if(status){            
            setFieldsValue({ status: status })  
        } else {
            setFieldsValue({ status: 'all' })
        }
        if(id){
            setFieldsValue({ id: id })      
        }
    }

    onDateChange(date){
        const { getFieldDecorator } = this.props.form
        const dateString = moment(date).format(config.date.dateLinkFormat)
        getFieldDecorator('dateString',   { initialValue: dateString })
    }

    onStatusSelect(val){
        const { getFieldDecorator } = this.props.form
        getFieldDecorator('status',   { initialValue: val })
    }

    onIdChange(val){
        const { getFieldDecorator } = this.props.form        
        getFieldDecorator('id',   { initialValue: val })
    }

    render(){
        const { dateString } = this.props
        const { getFieldDecorator }  = this.props.form
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
                <Form onSubmit = { e => this.handleSubmit(e) }>
                    <FormItem className='inline'>
                        {getFieldDecorator('dateString', { rules: [] })(
                            <DateInput
                                onDataToForm={ date => this.onDateChange(date) }
                                defaultDate={ currentDate }
                            />
                        )}
                    </FormItem>
                    
                    <FormItem className='inline'>
                        {getFieldDecorator('status', { rules: [] })(
                            <Select 
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

const mapStateToProps = state => ({
    //ordersOptions: getOrdersOptionsSelector(state)
})

const mapDispatchToProps = {
    setOrdersOptionsAction
}

const OrderFilterForm = Form.create()(OrderFilter)

//export default OrderFilterForm
export default connect(mapStateToProps, mapDispatchToProps)(OrderFilterForm)
