import React from 'react'

const Form = require('antd/lib/form')
require('antd/lib/form/style/css')
const Icon = require('antd/lib/icon')
require('antd/lib/icon/style/css')
const Button = require('antd/lib/button')
require('antd/lib/button/style/css')
const Input = require('antd/lib/input')
require('antd/lib/input/style/css')
const FormItem = Form.Item

import l from './LoginPage.less'

class LoginForm extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            message: null,
        }
    }

    componentDidMount(){
        this.props.form.validateFields()
    }

    async handleSubmit(e){
        e.preventDefault()
        this.props.form.validateFields((err, values) => {
            if (!err) {
                const login = values.login
                const password = values.password
                try {
                    return fetch('/login',{
                        method: 'POST',
                        headers: {
                            'Accept': 'application/json',
                            'Content-Type': 'application/json'
                        },
                        credentials: 'include',     // need to save cookies on browsers
                        redirect: 'follow',
                        body: JSON.stringify({
                            login: login,
                            password: password
                        })
                    })
                    .then(res => res.json())
                    .then(data => {
                        if(data.error){
                            this.setState({ message: 'Ошибка сервера. Попробуйте позже, или обратитесь к администратору сайта' })
                        } else if(data.redirectTo){
                            window.location.replace(data.redirectTo)
                        } else if(data.message){
                            this.setState({ message: data.message })
                        }
                    })
                } catch(err) {
                    console.log(`ERROR ${err.stack}`)
                }
            }
        })
    }

    hasErrors(fieldsError){
        return Object.keys(fieldsError).some(field => fieldsError[field])
    }

    onChange(e){
        this.setState({ message: null })
    }

    render(){
        const { message } = this.state        
        const { 
            getFieldDecorator, 
            isFieldTouched, 
            getFieldError, 
            getFieldsError 
        } = this.props.form
        const loginError = isFieldTouched('login') && getFieldError('login');
        const passwordError = isFieldTouched('password') && getFieldError('password')
        return (
            <div className={ l.root }>
                <h4>Введите данные Вашего аккаунта</h4>
                <Form onSubmit = { e => this.handleSubmit(e) }>
                    <FormItem
                        validateStatus={ loginError ? 'error' : '' }
                        help={ loginError || '' }
                    >
                        {getFieldDecorator('login', {
                            rules: [{ required: true, message: 'Введите логин' }],
                        })(
                            <Input 
                                prefix={<Icon type='user' />} 
                                placeholder='Логин'
                                onChange={ e => this.onChange(e) }
                            />
                        )}
                    </FormItem>
                    <FormItem
                        validateStatus={ passwordError ? 'error' : '' }
                        help={ passwordError || '' }
                    >
                        {getFieldDecorator('password', {
                            rules: [{ required: true, message: 'Введите пароль' }],
                        })(
                            <Input 
                                prefix={<Icon type='lock' />} 
                                type='password' 
                                placeholder='Пароль' 
                                onChange={ e => this.onChange(e) }    
                            />
                        )}
                    </FormItem>
                    <FormItem>
                        <Button 
                            type='primary'
                            htmlType='submit'
                            disabled={ this.hasErrors(getFieldsError()) }
                        >Вход</Button>
                    </FormItem>
                    { message && <div className={ l.error }>{ message }</div> }
                </Form>
            </div>
        )
    }
}

const Login = Form.create()(LoginForm)

export default Login
