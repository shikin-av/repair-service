import React from 'react'
import {Switch, Route} from 'react-router-dom'

import Categories from 'client/admin/components/pages/CategoriesPage/CategoriesPage.jsx'
import Users from 'client/admin/components/pages/UsersPage/UsersPage.jsx'

export default class Content extends React.Component {
    constructor(props){
        super(props)
    }

    render(){
        return (
            <Switch>
                <Route
                    exact path='/categories'
                    component={Categories} />
                <Route
                    exact path='/users'
                    component={Users} />
            </Switch>
        )
    }
}
