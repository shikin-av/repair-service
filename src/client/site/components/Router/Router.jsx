import React from 'react'
import { Switch, Route } from 'react-router-dom'

import Home from 'client/site/components/pages/Home/Home.jsx'
import Page404 from 'client/site/components/pages/Page404/Page404.jsx'
import Login from 'client/site/components/pages/Login/Login.jsx'
import Categories from 'client/site/components/pages/Categories/Categories.jsx'
import Order from 'client/site/components/pages/Order/Order.jsx'
import Questions from 'client/site/components/pages/Questions/Questions.jsx'
import Shares from 'client/site/components/pages/Shares/Shares.jsx'
import Testimonials from 'client/site/components/pages/Testimonials/Testimonials.jsx'

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
                className={ `wrapper ${ l.root }` }
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
                    <Route 
                        exact path='/questions'
                        component={ Questions }
                    />
                    <Route 
                        exact path='/shares'
                        component={ Shares }
                    />
                    <Route 
                        exact path='/testimonials'
                        component={ Testimonials }
                    />
                    <Route component={ Page404 } />
                </Switch>
            </div>
        )
    }
}
