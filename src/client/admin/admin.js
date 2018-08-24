import React from 'react'
import ReactDOM from 'react-dom'
import { createStore, applyMiddleware } from 'redux'
import { Provider } from 'react-redux'
import createHistory from 'history/createHashHistory'
import { ConnectedRouter as Router, routerMiddleware } from 'react-router-redux'
import { composeWithDevTools } from 'redux-devtools-extension'
import thunk from 'redux-thunk'
import 'babel-polyfill'
import moment from 'moment'

import reducers from 'client/admin/reducers'
import ContentRouter from 'client/admin/components/Router/Router.jsx'
import MainMenu from 'client/admin/components/MainMenu/MainMenu.jsx'
import 'client/admin/components/style/app.css'
import OrderNotification from 'client/admin/components/content/OrderNotification/OrderNotification.jsx'

require('antd/lib/icon/style/css')
const Layout = require('antd/lib/layout')
require('antd/lib/layout/style/css')
const { Header, Content, Sider } = Layout

const history = createHistory()
const historyMiddleware = routerMiddleware(history)
const store = createStore(reducers, composeWithDevTools(applyMiddleware(historyMiddleware, thunk)))

import l from 'client/admin/components/style/content.less'

class App extends React.Component {
    constructor(props){
        super(props)
    }

    componentWillMount(){
        moment.locale('ru')   
    }

    render(){
        return (
            <Layout>
                <Header/>
                <OrderNotification/>
                <Layout>
                    <Sider id='sider'>
                        <MainMenu/>
                    </Sider>
                    <Layout className={ l.root }>
                        <ContentRouter/>
                    </Layout>
                </Layout>
            </Layout>
        )
    }
}

ReactDOM.render(
    <Provider store={ store }>
        <Router history={ history }>
            <App />
        </Router>
    </Provider>,
    document.getElementById('root')
)
