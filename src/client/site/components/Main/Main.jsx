import React from 'react'
import {Switch, Route} from 'react-router-dom'

import Home from 'client/site/components/Home/Home.jsx'

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
            </Switch>
        )
    }
}
