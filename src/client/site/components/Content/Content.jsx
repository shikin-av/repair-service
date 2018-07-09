import React from 'react'
import {Switch, Route} from 'react-router-dom'

import Home from 'client/site/components/pages/Home/Home.jsx'
import Page404 from 'client/site/components/pages/Page404/Page404.jsx'

import l from './Content.less'

export default class Content extends React.Component {
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
        const { isMobile } = this.props
        return (
            <div 
                style={ isMobile ? null : {marginTop: this.props.marginTop} }
                className={ l.root }
            >
                <Switch>
                    <Route
                        exact path='/'
                        component={Home} />
                    <Route component={Page404} />
                </Switch>
            </div>
        )
    }
}
