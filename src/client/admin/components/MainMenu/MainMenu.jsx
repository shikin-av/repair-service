import React from 'react'
import { Link } from 'react-router-dom'

const Menu = require('antd/lib/menu')
require('antd/lib/menu/style/css')
const { SubMenu } = Menu
const Icon = require('antd/lib/icon')
require('antd/lib/icon/style/css')

import menu from 'config/menuAdmin'

import l from './MainMenu.less'

const MainMenu = props => (
    <Menu
        mode='vertical'
        className={ l.root }
    >
        {
            menu.map(item =>{
                let text = ( <span>{ item.text }</span> )
                if(item.icon){
                    text = ( <span><Icon type={ item.icon } />{ item.text }</span> )
                }
                if(item.submenu){
                    return (
                        <SubMenu
                            key={ item.url }
                            title={ text }
                        >
                        {
                            item.submenu.map(item => {
                                let text = ( <span>{ item.text }</span> )
                                if(item.icon){
                                    text = ( <span><Icon type={ item.icon } />{ item.text }</span> )
                                }
                                return (
                                    <Menu.Item 
                                        key={ item.url }
                                    >
                                        <Link to={ item.url }>
                                            { text }
                                        </Link>
                                    </Menu.Item>
                                )
                            })
                        }
                        </SubMenu>
                    )
                } else return (
                    <Menu.Item 
                        key={ item.url }
                    >
                        <Link to={ item.url }>
                            { text }
                        </Link>
                    </Menu.Item>
                )
            })
        }
    </Menu>
)

export default MainMenu
