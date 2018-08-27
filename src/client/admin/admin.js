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
import device from 'current-device'

import reducers from 'client/admin/reducers'
import ContentRouter from 'client/admin/components/Router/Router.jsx'

import 'client/admin/components/style/app.css'
import OrderNotification from 'client/admin/components/content/OrderNotification/OrderNotification.jsx'
import Sidebar from 'client/admin/components/content/Sidebar/Sidebar.jsx'

require('antd/lib/icon/style/css')
const Layout = require('antd/lib/layout')
require('antd/lib/layout/style/css')

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
        this.isMobile = device.mobile()  
    }

    render(){
        return (
            <Layout>                
                <OrderNotification/>
                <Layout>
                    <Sidebar isMobile={ this.isMobile }/>                    
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
