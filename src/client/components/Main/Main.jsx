import React from 'react'
import {Switch, Route} from 'react-router-dom'

import Login from '../Login/Login.jsx'
import Home from '../Home/Home.jsx'

export default class Main extends React.Component {
    constructor(props){
        super(props)
    }

    render(){
        return (
            <Switch>
                <Route
                    exact path='/'
                    component={Home} />
                <Route
                    exact path='/login'
                    component={Login} />
            </Switch>
        )
    }
}
