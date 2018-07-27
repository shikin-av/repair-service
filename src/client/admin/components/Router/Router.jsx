import React from 'react'
import {Switch, Route} from 'react-router-dom'

import Categories from 'client/admin/components/pages/categories/GetAll/GetAll.jsx'
import CategoryEdit from 'client/admin/components/pages/categories/Edit/Edit.jsx'
import CategoryCreate from 'client/admin/components/pages/categories/Create/Create.jsx'

import Gallery from 'client/admin/components/pages/GalleryPage/GalleryPage.jsx'

import Cities from 'client/admin/components/pages/cities/GetAll/GetAll.jsx'
import CityEdit from 'client/admin/components/pages/cities/Edit/Edit.jsx'
import CityCreate from 'client/admin/components/pages/cities/Create/Create.jsx'

export default class Router extends React.Component {
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
                    exact path='/cities'
                    component={ Cities } />
                <Route
                    exact path='/cities/create'
                    component={ CityCreate } />
                <Route
                    exact path='/cities/:nameUrl'
                    component={ CityEdit } />
                <Route
                    exact path='/gallery'
                    component={ Gallery } />
            </Switch>
        )
    }
}
