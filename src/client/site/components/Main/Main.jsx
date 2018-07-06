import React from 'react'
import {Switch, Route} from 'react-router-dom'

import Home from 'client/site/components/pages/Home/Home.jsx'
import Page404 from 'client/site/components/pages/Page404/Page404.jsx'

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
                <Route component={Page404} />
            </Switch>
        )
    }
}
