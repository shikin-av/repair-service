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
import ContentRouter from 'client/admin/components/Content/Content.jsx'
import socketsHandler from 'client/admin/resources/socketsHandler'
import getCookie from 'client/admin/resources/getCookie'

require('antd/lib/icon/style/css')
const Layout = require('antd/lib/layout')
require('antd/lib/layout/style/css')
const { Header, Content, Sider } = Layout

import MainMenu from 'client/admin/components/MainMenu/MainMenu.jsx'
import 'client/admin/components/common/app.css'

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
            <Layout>
                <Header/>
                <Layout>
                    <Sider id='sider'>
                        <MainMenu/>
                    </Sider>
                    <Layout>
                        <ContentRouter/>
                    </Layout>
                </Layout>
            </Layout>
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
