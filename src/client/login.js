import React from 'react'
import ReactDOM from 'react-dom'
import 'babel-polyfill'

class Login extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            login: null,
            password: null,
            message: null,
        }
    }

    async handleSubmit(e){
        e.preventDefault()
        const { login, password, message } = this.state
        const loginNull = (login == null || login == '')
        const passwordNull = (password == null || password == '')

        if(loginNull && passwordNull){
            this.setState({ message: 'заполните поля Логин и Пароль' })
        } else if(loginNull){
            this.setState({ message: 'заполните полe Логин' })
        } else if(passwordNull){
            this.setState({ message: 'заполните полe Пароль' })
        } else {
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
                    } else if(data.redirect){
                        window.location.href = data.redirect
                    } else if(data.message){
                        this.setState({ message: data.message })
                    }
                })
            } catch(err) {
                console.log(`ERROR ${err.stack}`)
            }
        }

    }

    handleLoginChange(e){
        this.setState({ login: e.target.value })
    }

    handlePasswordChange(e){
        this.setState({ password: e.target.value })
    }

    render(){
        const { login, password, message } = this.state
        return (
            <div>
                <h1>Login</h1>
                <form
                    onSubmit = { e => this.handleSubmit(e) }
                >
                    <input
                        type='text'
                        name='login'
                        placeholder='Логин'
                        required
                        onChange={ e => this.handleLoginChange(e) }
                        value={ login || '' }
                    />
                    <br/>
                    <input
                        type='password'
                        name='password'
                        placeholder='Пароль'
                        required
                        onChange={ e => this.handlePasswordChange(e) }
                        value={ password || '' }
                    />
                    <br/>
                    <input
                        type='submit'
                        value='Вход'
                    />
                </form>
                { message && <div className='message'>{ message }</div> }
            </div>
        )
    }
}

ReactDOM.render(
    <Login />,
    document.getElementById('root')
)
