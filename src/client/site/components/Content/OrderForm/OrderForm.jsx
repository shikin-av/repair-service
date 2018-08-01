import React from 'react'
import { object, array } from 'prop-types'
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
const FormItem = Form.Item
const Icon = require('antd/lib/icon')
require('antd/lib/icon/style/css')
const Button = require('antd/lib/button')
require('antd/lib/button/style/css')
const Alert = require('antd/lib/alert')
require('antd/lib/alert/style/css')
const Spin = require('antd/lib/spin')
require('antd/lib/spin/style/css')

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
        this.state = {
            status: 'new'
        }
    }

    async handleSubmit(e){
        const { getFieldDecorator }  = this.props.form
        const { currentCity, category } = this.props
        e.preventDefault()        
        this.onCityChange(currentCity.name)                
        getFieldDecorator('categoryShortName', { initialValue: category.shortName })
        getFieldDecorator('categoryNameUrl',   { initialValue: category.nameUrl })
        this.props.form.validateFields((err, values) => {
            if (!err) {
                //console.log(values)                
                try {
                    this.setState({ status: 'pending' })
                    createOrderApi(values)
                    .then(res => {                        
                        if(res.status == 'OK'){
                            this.setState({ status: 'complite' })
                            const socket = openSocket(`${ config.protocol }://${ config.host }:${ config.port }`)
                            socket.on('connected', data => {
                                console.log('i connected')
                                socket.emit('clientOrder', res.order)
                            })        
                        } else {
                            this.setState({ status: 'error' })
                        }
                    })
                } catch(err) {
                    console.log(`ERROR ${err.stack}`)
                    //TODO
                    this.setState({ status: 'error' })
                }
            }
        })
    }

    showSubmitOrMessage(){
        const { currentCity } = this.props
        const { status } = this.state
        switch(status){
            case 'new':
                return(
                    <FormItem>
                        <Button 
                            type='primary'
                            htmlType='submit'
                        >Отправить</Button>
                    </FormItem>
                )
            case 'pending':
                return (
                    <Spin/>
                )

            case 'complite':
                return (
                    <Alert 
                        message='Ваша заявка принята в работу. Наш менеджер свяжется с Вами в ближайшее время'
                        type='success'
                        closable
                        onClose={ () => this.setState({ status: 'new' })}
                    />
                )
            case 'error':
                return (
                    <Alert 
                        message={ `Что то пошло не так. Свяжитесь с нами по телефону ${ currentCity.phone }` }
                        type='error'
                        closable
                        onClose={ () => this.setState({ status: 'new' })}
                    />
                )
        }
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

    onCityChange(cityName){
        const { 
            cities,
            setCurrentCityAction 
        } = this.props
        const { getFieldDecorator } = this.props.form
        
        this.props.form.setFieldsValue({ city: cityName })
        const currentCity = cities[_.findIndex(cities, { name: cityName })]                
        const cityNameUrl = currentCity.nameUrl
        getFieldDecorator('cityNameUrl',   { initialValue: cityNameUrl })

        console.log('name ', cityName, ' | nameUrl ', cityNameUrl)

        setCurrentCityAction(currentCity)
        localStorage.setItem('currentCity', JSON.stringify(currentCity))
        
        
        /*this.props.form.setFieldsValue({ city: obj.name })
        getFieldDecorator('cityNameUrl',   { initialValue: obj.nameUrl })
        */
        /*const currentCity = cities[_.findIndex(cities, { name: obj.name })]        
        setCurrentCityAction(currentCity)
        localStorage.setItem('currentCity', JSON.stringify(currentCity))*/
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
                        { currentCity && 
                          currentCity.name &&
                          cities.length &&
                        <FormItem label='Ваш город:'>
                            {getFieldDecorator('city', { rules: [
                                { required: true, message: 'Обязательное поле' }
                            ] })(
                                <SelectCity 
                                    onDataToForm={ val => this.onCityChange(val) }
                                    cities={ cities }
                                    currentCity={ currentCity }
                                />
                            )}
                        </FormItem>
                        }
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

                        { this.showSubmitOrMessage() }
                        
                    </Form>

                </div>
            )
        } else return null
    }
}

Order.propTypes = {
    category:    object,
    cities:      array,
    currentCity: object
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