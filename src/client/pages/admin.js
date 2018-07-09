import React from 'react'
import ReactDOM from 'react-dom'
import { createStore, applyMiddleware } from 'redux'
import { Provider } from 'react-redux'
import createHistory from 'history/createHashHistory'
import { ConnectedRouter as Router, routerMiddleware } from 'react-router-redux'
import { composeWithDevTools } from 'redux-devtools-extension'
import thunk from 'redux-thunk'
import 'babel-polyfill'

import reducers from 'client/admin/reducers'
import Content from 'client/admin/components/Content/Content.jsx'
import socketsHandler from 'client/admin/resources/socketsHandler'
import getCookie from 'client/admin/resources/getCookie'


const history = createHistory()
const historyMiddleware = routerMiddleware(history)
const store = createStore(reducers, composeWithDevTools(applyMiddleware(historyMiddleware, thunk)))

class App extends React.Component {
    constructor(props){
        super(props)
    }

    componentDidMount(){
        const authToken = getCookie('auth_token')
        if(authToken){
            socketsHandler(authToken)
        }
    }

    render(){
        return (
            <div>
                <Content />
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
