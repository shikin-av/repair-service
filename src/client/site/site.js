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

const history = createHistory()
const historyMiddleware = routerMiddleware(history)
const store = createStore(reducers, composeWithDevTools(applyMiddleware(historyMiddleware, thunk)))

class App extends React.Component {
    constructor(props){
        super(props)
    }

    componentWillMount(){
        this.isMobile = device.mobile()
    }

    componentDidMount(){
        socketsHandler()
    }    

    render(){
        return (
            <div>
                <Header isMobile={ this.isMobile } />
                <Content isMobile={ this.isMobile } />
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