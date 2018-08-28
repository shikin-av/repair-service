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
import Header from 'client/site/components/Header/Header.jsx'
import Footer from 'client/site/components/Footer/Footer.jsx'
import ContentRouter from 'client/site/components/Router/Router.jsx'

require('antd/lib/icon/style/css')
import 'client/site/components/style/app.css'

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

    render(){
        return (
            <div>
                <Header isMobile={ this.isMobile } />
                <ContentRouter isMobile={ this.isMobile } />
                <Footer/>
            </div>
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