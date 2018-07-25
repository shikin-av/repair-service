import React from 'react'
import {Switch, Route} from 'react-router-dom'

import Home from 'client/site/components/pages/HomePage/HomePage.jsx'
import Page404 from 'client/site/components/pages/Page404/Page404.jsx'
import Login from 'client/site/components/pages/LoginPage/LoginPage.jsx'
import Categories from 'client/site/components/pages/CategoriesPage/CategoriesPage.jsx'
import Order from 'client/site/components/pages/OrderPage/OrderPage.jsx'

import l from './Router.less'

export default class Router extends React.Component {
    constructor(props){
        super(props)
    }

    componentWillUpdate(){
        const { isMobile } = this.props
        if(isMobile){
            document.getElementById('main-menu').scrollIntoView(true)
        }else{
            document.documentElement.scrollTop = 0
        }
    }

    render(){
        return (
            <div
                className={ `${l.root} wrapper` }
            >
                <Switch>
                    <Route
                        exact path='/'
                        component={ Home } />
                    <Route 
                        exact path='/login'
                        component={ Login }
                    />
                    <Route 
                        exact path='/categories'
                        component={ Categories }
                    />
                    <Route 
                        exact path='/categories/:nameurl'
                        component={ Order }
                    />
                    <Route component={ Page404 } />
                </Switch>
            </div>
        )
    }
}
