import React from 'react'
import {Link} from 'react-router-dom'

const Menu = require('antd/lib/menu')
require('antd/lib/menu/style/css')
const SubMenu = Menu.SubMenu
const Icon = require('antd/lib/icon')
require('antd/lib/icon/style/css')
const Button = require('antd/lib/button')
require('antd/lib/button/style/css')

import config from 'client/config'
import l from './MainMenu.less'

export default class MainMenu extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            collapsed: true
        }
    }

    renderMenuItem(item){
        return (
            <Menu.Item 
                key={ Math.random() }
                onClick={ e => this.toggleCollapsed(e) }
            >
                <Link to={ item.url }>
                    { item.text }
                </Link>
            </Menu.Item>
        )
    }

    toggleCollapsed(e){
        this.setState({ collapsed: !this.state.collapsed })
    }

    render(){
        const items = config.menu
        const { isMobile } = this.props
        const { collapsed } = this.state
        if(isMobile){
            return (
                <div>
                    <Button 
                        icon='bars'
                        size='large'
                        onClick={ e => this.toggleCollapsed(e) }
                        className={ l.collapseButton }
                    >МЕНЮ</Button>
                    <Menu
                        mode='inline'
                        inlineCollapsed={ this.state.collapsed }
                        id='main-menu'
                        className={ l.root }
                        style={ collapsed ? {display: 'none'} : {display: 'block'} }
                    >
                        {
                            items.map(item => {
                                return this.renderMenuItem(item)
                            })
                        }
                    </Menu>
                </div>
            )
        } else {
            return (
                <Menu
                    mode='horizontal'
                    id='main-menu'
                    className={ l.root }
                >
                    {
                        items.map(item => {
                            return this.renderMenuItem(item)
                        })
                    }
                </Menu>
            )
        }
    }
}