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
    }

    handleSubmit(e){
        const { cityNameUrl, setOrdersOptionsAction } = this.props
        e.preventDefault()
        this.props.form.validateFields((err, values) => {
            if (!err) {
                console.log('Filter values ', values)
                const link = `/admin#/orders/date/${ values.dateString }`
                setOrdersOptionsAction({
                    cityNameUrl: cityNameUrl,
                    dateToLink: values.dateString
                }).then(() => {
                    window.location.replace(link)
                })
            }
        })
    }

    componentDidMount(){
        const { cityNameUrl, dateString } = this.props        
    }

    onDateChange(date){
        const { getFieldDecorator } = this.props.form
        const dateString = moment(date).format(config.date.dateLinkFormat)
        getFieldDecorator('dateString',   { initialValue: dateString })
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
                    <FormItem>
                        {getFieldDecorator('dateString', { rules: [] })(
                            <DateInput
                                onDataToForm={ date => this.onDateChange(date) }
                                defaultDate={ currentDate }
                            />
                        )}
                    </FormItem>

                    <FormItem>
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
