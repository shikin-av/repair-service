import React from 'react'
import { object } from 'prop-types'
import { Link } from 'react-router-dom'
import openSocket from 'socket.io-client'
import { connect } from 'react-redux'
import _ from 'lodash'

const Row = require('antd/lib/row')
require('antd/lib/row/style/css')
const Col = require('antd/lib/col')
require('antd/lib/col/style/css')
const Form = require('antd/lib/form')
require('antd/lib/form/style/css')
const Icon = require('antd/lib/icon')
require('antd/lib/icon/style/css')
const Button = require('antd/lib/button')
require('antd/lib/button/style/css')
const Input = require('antd/lib/input')
require('antd/lib/input/style/css')
const FormItem = Form.Item

import config            from 'client/../config/client'
import FirmsAutocomplete from './formItems/FirmsAutocomplete/FirmsAutocomplete.jsx'
import DateInput         from './formItems/DateInput/DateInput.jsx'
import TimeInput         from './formItems/TimeInput/TimeInput.jsx'
import HowOld            from './formItems/HowOld/HowOld.jsx'
import Description       from './formItems/Description/Description.jsx'
import AddressInput      from './formItems/AddressInput/AddressInput.jsx'
import SimpleInput       from './formItems/SimpleInput/SimpleInput.jsx'
import Problems          from './formItems/Problems/Problems.jsx'
import SelectCity        from './formItems/SelectCity/SelectCity.jsx'

import { createOrder as createOrderApi } from 'client/site/api'
import {     
    setCurrentCity   as setCurrentCityAction
} from 'client/site/actions/cities'
import { 
    getCities      as getCitiesSelector,
    getCurrentCity as getCurrentCitySelector
} from 'client/site/selectors/cities'

import l from './OrderForm.less'

class Order extends React.Component {
    constructor(props){
        super(props)
    }

    async handleSubmit(e){
        const { getFieldDecorator }  = this.props.form
        const { currentCity, category } = this.props
        e.preventDefault()
                
        this.onCityChange(currentCity)

        console.log('CATEGORY ', category)
        const categoryShortName = 'Телевизор'   //TODO get in Redux Store       
        getFieldDecorator('categoryShortName', { initialValue: categoryShortName })
        
        this.props.form.validateFields((err, values) => {
            if (!err) {
                console.log(values)
                
                try {
                    createOrderApi(values)
                    .then(res => {                        
                        if(res.status == 'OK'){                            
                            const socket = openSocket(`${ config.protocol }://${ config.host }:${ config.port }`)
                            socket.on('connected', data => {
                                console.log('i connected')
                                socket.emit('clientOrder', res.order)
                            })        
                        }
                    })
                } catch(err) {
                    console.log(`ERROR ${err.stack}`)
                    //TODO message
                }
                
                
            } else {

            }
        })
    }
    
    onFirmSelect(val) {
        this.props.form.setFieldsValue({ firm: val})
    }

    onDateChange(val){
        this.props.form.setFieldsValue({ date: val })
    }

    onTimeChange(val){
        this.props.form.setFieldsValue({ time: val })
    }

    onHowOldChange(val){
        this.props.form.setFieldsValue({ howOld: val })
    }

    onDescriptionChange(val){
        this.props.form.setFieldsValue({ description: val })
    }

    onAddressChange(val){
        this.props.form.setFieldsValue({ address: val })
    }

    onPhoneChange(val){
        this.props.form.setFieldsValue({ phone: val })
    }

    onNameChange(val){
        this.props.form.setFieldsValue({ name: val })
    }

    onProblemsChange(values){        
        this.props.form.setFieldsValue({ problems: values })
    }

    onCityChange(val){
        const { cities, setCurrentCityAction } = this.props
        this.props.form.setFieldsValue({ city: val })
        const currentCity = cities[_.findIndex(cities, { name: val })]        
        setCurrentCityAction(currentCity)
        localStorage.setItem('currentCity', JSON.stringify(currentCity))
    }

    render(){
        const { category, cities, currentCity } = this.props
        const { getFieldDecorator }  = this.props.form
        const categoriesLink = '/categories'
        
        if(category && category.name){
            return (
                <div className={ l.root }>
                    <h1>{ `Заявка на ${ category.singularName }` }</h1>
                    <Row>
                        <Col
                            xs={8}
                            md={6}
                        >
                            <Link to={ categoriesLink }>
                                <img src={ `${ config.assetsPath }/imgs/${ category.image }` }/>
                            </Link>
                        </Col>
                        <Col
                            xs={16}
                            md={18}
                        >
                            <p className={ l.otherText }>
                                <Link to={ categoriesLink }>
                                    Кликните, чтобы выбрать <u>другую</u> услугу
                                </Link>
                            </p>
                            <p className={ l.arrow }>
                                <Link to={ categoriesLink }>
                                    <Icon type="enter" />
                                </Link>
                            </p>
                        </Col>
                    </Row>

                    <Form onSubmit = { e => this.handleSubmit(e) }>
                        <Row>
                            <Col
                                sm={24}
                                md={16}
                            >
                                <FormItem label='Когда нужен мастер'>
                                    {getFieldDecorator('date', { rules: [] })(
                                        <DateInput onDataToForm={ val => this.onDateChange(val) } />
                                    )}
                                </FormItem>
                            </Col>
                            <Col
                                sm={24}
                                md={8}
                            >
                                <FormItem label='В какое время'>
                                    {getFieldDecorator('time', { rules: [] })(
                                        <TimeInput onDataToForm={ val => this.onTimeChange(val) } />
                                    )}
                                </FormItem>
                            </Col>
                        </Row>
                        

                        <FormItem label='Фирма производитель:'>
                            {getFieldDecorator('firm', { rules: [] })(
                                <FirmsAutocomplete onDataToForm={ val => this.onFirmSelect(val) } />
                            )}
                        </FormItem>

                        <FormItem label='Сколько лет технике (примерно):'>
                            {getFieldDecorator('howOld', { rules: [] })(
                                <HowOld onDataToForm={ val => this.onHowOldChange(val) } />
                            )}
                        </FormItem>
                        
                        { category.problems.length ?
                            <FormItem label='Выберите варианты:'>
                                {getFieldDecorator('problems', { rules: [] })(
                                    <Problems 
                                        problems={ category.problems }
                                        onDataToForm={ val => this.onProblemsChange(val) } 
                                    />
                                )}
                            </FormItem>
                            : null
                        }

                        <FormItem label='Описание проблемы (кратко):'>
                            {getFieldDecorator('description', { rules: [] })(
                                <Description onDataToForm={ val => this.onDescriptionChange(val) } />
                            )}
                        </FormItem>

                        <FormItem label='Ваш город:'>
                            {getFieldDecorator('city', { rules: [] })(
                                <SelectCity 
                                    onDataToForm={ val => this.onCityChange(val) }
                                    cities={ cities }
                                    currentCity={ currentCity }
                                />
                            )}
                        </FormItem>
                        { currentCity && currentCity.name &&
                        <FormItem label='Ваш адрес:'>
                            {getFieldDecorator('address', { rules: [
                                { required: true, message: 'Обязательное поле' }
                            ] })(
                                <AddressInput 
                                    onDataToForm={ val => this.onAddressChange(val) }
                                    city={ currentCity.name } 
                                />
                            )}
                        </FormItem>
                        }
                        <FormItem label='Ваш телефон:'>
                            {getFieldDecorator('phone', { rules: [
                                { required: true, message: 'Обязательное поле' }
                            ] })(
                                <SimpleInput 
                                    onDataToForm={ val => this.onPhoneChange(val) } 
                                    placeholder='Контактный номер телефона'
                                />
                            )}
                        </FormItem>

                        <FormItem label='Ваше имя:'>
                            {getFieldDecorator('name', { rules: [
                                { required: true, message: 'Обязательное поле' }
                            ] })(
                                <SimpleInput 
                                    onDataToForm={ val => this.onNameChange(val) } 
                                    placeholder='Контактное лицо'
                                />
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

const mapStateToProps = state => ({
    cities: getCitiesSelector(state),
    currentCity: getCurrentCitySelector(state)  
})
const mapDispatchToProps = {    
    setCurrentCityAction
}
export default connect(mapStateToProps, mapDispatchToProps)(OrderForm)