import React from 'react'
//import _ from 'lodash'
import { object } from 'prop-types'

const Form = require('antd/lib/form')
require('antd/lib/form/style/css')
const Icon = require('antd/lib/icon')
require('antd/lib/icon/style/css')
const Button = require('antd/lib/button')
require('antd/lib/button/style/css')
const Input = require('antd/lib/input')
require('antd/lib/input/style/css')
const FormItem = Form.Item

import FirmsAutocomplete from './formItems/FirmsAutocomplete/FirmsAutocomplete.jsx'
import DateInput from './formItems/DateInput/DateInput.jsx'

import l from './OrderForm.less'

class Order extends React.Component {
    constructor(props){
        super(props)
    }

    async handleSubmit(e){
        e.preventDefault()
        this.props.form.validateFields((err, values) => {
            if (!err) {
                console.log(values)
            } else {

            }
        })
    }
    
    onFirmSelect(val) {
        this.props.form.setFieldsValue({ 
            firm: val
        })
    }

    onDateChange(val){
        this.props.form.setFieldsValue({ 
            date: val
        })
    }

    render(){
        const { category } = this.props
        const { getFieldDecorator }  = this.props.form
        if(category && category.name){
            return (
                <div className={ l.root }>
                    <h1>{ `Заявка на ${ category.singularName }` }</h1>
                    <img src={ `/assets/imgs/categories/${ category.image }` }/>

                    <Form onSubmit = { e => this.handleSubmit(e) }>
                        
                        <FormItem label='Когда нужен мастер?'>
                            {getFieldDecorator('date', { rules: [] })(
                                <DateInput onDataToForm={ val => this.onDateChange(val) } />
                            )}
                        </FormItem>
                        <FormItem label='Фирма производитель:'>
                            {getFieldDecorator('firm', { rules: [] })(
                                <FirmsAutocomplete onDataToForm={ val => this.onFirmSelect(val) } />
                            )}
                        </FormItem>                       

                        <FormItem>
                            <Button 
                                type='primary'
                                htmlType='submit'
                            >Отправить</Button>
                        </FormItem>
                        
                    </Form>

                </div>
            )
        } else return null
    }
}

Order.propTypes = {
    category: object,
}

const OrderForm = Form.create()(Order)

export default OrderForm