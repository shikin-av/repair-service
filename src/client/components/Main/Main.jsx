import React from 'react'
import {Switch, Route} from 'react-router-dom'

import Home from '../Home/Home.jsx'
import User from '../User/User.jsx'

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
                    exact path='/user'
                    component={User} />
            </Switch>
        )
    }
}
