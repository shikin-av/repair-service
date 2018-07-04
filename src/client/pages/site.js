import React from 'react'
import ReactDOM from 'react-dom'
import { createStore, applyMiddleware } from 'redux'
import { Provider } from 'react-redux'
import createHistory from 'history/createHashHistory'
import { ConnectedRouter as Router, routerMiddleware } from 'react-router-redux'
import { composeWithDevTools } from 'redux-devtools-extension'
import thunk from 'redux-thunk'
import 'babel-polyfill'

import reducers from 'client/site/reducers'
import Main from 'client/site/components/Main/Main.jsx'
import socketsHandler from 'client/site/resources/socketsHandler'
import Header from 'client/site/components/Header/Header.jsx'

const history = createHistory()
const historyMiddleware = routerMiddleware(history)
const store = createStore(reducers, composeWithDevTools(applyMiddleware(historyMiddleware, thunk)))

class App extends React.Component {
    constructor(props){
        super(props)
    }

    componentDidMount(){
        socketsHandler()
    }

    render(){
        return (
            <div>
                <Header />
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