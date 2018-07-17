import React from 'react'
import { Link } from 'react-router-dom'

const Menu = require('antd/lib/menu')
require('antd/lib/menu/style/css')
const { SubMenu } = Menu
const Icon = require('antd/lib/icon')
require('antd/lib/icon/style/css')

import menu from 'client/config/menuAdmin'

import l from './MainMenu.less'

const MainMenu = props => (
    <Menu
        mode='inline'
        className={ l.root }
    >
        {
            menu.map(item =>(
                <Menu.Item 
                    key={ Math.random() }
                >
                    <Link to={ item.url }>
                        { item.text }
                    </Link>
                </Menu.Item>
            ))
        }
    </Menu>
)

export default MainMenu
