import React from 'react'
import { Link } from 'react-router-dom'

import MainMenu from 'client/admin/components/MainMenu/MainMenu.jsx'
import DemoMessage from 'client/admin/components/content/DemoMessage/DemoMessage.jsx'
import getCookie from 'client/admin/resources/getCookie'
import config from 'config/client'

const Layout = require('antd/lib/layout')
require('antd/lib/layout/style/css')
const { Sider } = Layout
//const Drawer = require('antd/lib/drawer')
//require('antd/lib/divider/style/css')
const Button = require('antd/lib/button')
require('antd/lib/button/style/css')
const Icon = require('antd/lib/icon')
require('antd/lib/icon/style/css')

import l from './Sidebar.less'

class Header extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            collapsed: false
        }
    }

    componentWillMount(){
        const { isMobile } = this.props
        if(isMobile){
            this.setState({ collapsed: true })
        }
    }

    onCollapse(collapsed){
        this.setState({ collapsed })
    }

    render(){
        const { collapsed } = this.state
        const { isMobile } = this.props
        const logo = collapsed ? config.assets.logo.mini : config.assets.logo.gorizontal
        return (
            <Sider 
                id='sider' 
                className={ l.root }
                collapsible
                collapsed={ collapsed }
                onCollapse={ collapsed =>  this.onCollapse(collapsed) }
            >
                <div className={ l.logo }>
                    <Link to='/'>
                        <img src={`${ config.assetsPath }/imgs/design/${ logo }`}/>
                    </Link>
                </div>
                <MainMenu 
                    collapsed={ collapsed }
                    isMobile={ isMobile }
                />        
                {
                    getCookie('demo') && !collapsed &&
                    <DemoMessage/>
                }
            </Sider>       
        )
    }
    

    
    
}

export default Header