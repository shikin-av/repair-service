import React from 'react'
import ReactDOM from 'react-dom'
import { createStore, applyMiddleware } from 'redux'
import { Provider } from 'react-redux'
import createHistory from 'history/createHashHistory'
import { ConnectedRouter as Router, routerMiddleware } from 'react-router-redux'
import { composeWithDevTools } from 'redux-devtools-extension'
import thunk from 'redux-thunk'
import 'babel-polyfill'
import device from 'current-device'

import reducers from 'client/site/reducers'
import socketsHandler from 'client/site/resources/socketsHandler'
import Header from 'client/site/components/Header/Header.jsx'
import Content from 'client/site/components/Content/Content.jsx'

require('antd/lib/icon/style/css')
/*const Layout = require('antd/lib/layout')
require('antd/lib/layout/style/css')
const { Header, Content, Footer } = Layout*/

const history = createHistory()
const historyMiddleware = routerMiddleware(history)
const store = createStore(reducers, composeWithDevTools(applyMiddleware(historyMiddleware, thunk)))

class App extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            headerHeight: 0
        }
    }

    componentWillMount(){
        this.isMobile = device.mobile()
    }

    componentDidMount(){
        socketsHandler()
    }

    headerHeightHadler(val){
        this.setState({ headerHeight: val })
    }

    render(){
        return (
            <div>
                <Header 
                    onHeaderHeight={ val => this.headerHeightHadler(val) } 
                    isMobile={ this.isMobile }
                />
                <Content 
                    marginTop={ this.state.headerHeight } 
                    isMobile={ this.isMobile }
                />
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