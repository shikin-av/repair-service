import React from 'react'
import ReactDOM from 'react-dom'
import { createStore, applyMiddleware } from 'redux'
import { Provider } from 'react-redux'
import createHistory from 'history/createHashHistory'
import { ConnectedRouter as Router, routerMiddleware } from 'react-router-redux'
import { composeWithDevTools } from 'redux-devtools-extension'
import thunk from 'redux-thunk'
import 'babel-polyfill'
import openSocket from 'socket.io-client'

import reducers from './site/reducers'
import Main from './site/components/Main/Main.jsx'

const history = createHistory()
const historyMiddleware = routerMiddleware(history)
const store = createStore(reducers, composeWithDevTools(applyMiddleware(historyMiddleware, thunk)))

const socket = openSocket('http://localhost:80')

class App extends React.Component {
    constructor(props){
        super(props)
    }

    componentDidMount(){
        socket.on('connected', data => {
            console.log(data)
            socket.emit('test', 'test msg')
        })
    }

    render(){
        return (
            <div>
                <Main />
            </div>
        )
    }
}

ReactDOM.render(
    <Provider store={store}>
        <Router history={history}>
            <App />
        </Router>
    </Provider>,
    document.getElementById('root')
)