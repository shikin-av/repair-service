import React from 'react'
import {Switch, Route} from 'react-router-dom'

import Categories from 'client/admin/components/pages/CategoriesPage/CategoriesPage.jsx'
import CategoryEdit from 'client/admin/components/pages/CategoryEditPage/CategoryEditPage.jsx'
import CategoryCreate from 'client/admin/components/pages/CategoryCreatePage/CategoryCreatePage.jsx'

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
                    component={ Categories } />
                <Route
                    exact path='/categories/create'
                    component={ CategoryCreate } />
                <Route
                    exact path='/categories/:nameUrl'
                    component={ CategoryEdit } />
                <Route
                    exact path='/users'
                    component={ Users } />
            </Switch>
        )
    }
}
