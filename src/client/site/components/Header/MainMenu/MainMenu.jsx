import React from 'react'
import {Link} from 'react-router-dom'

const Menu = require('antd/lib/menu')
require('antd/lib/menu/style/css')

import l from './MainMenu.less'

const MainMenu = (props) => (
    <Menu
        mode="horizontal"
        id='main-menu'
        className={ l.root }
    >
        <Menu.Item>
            <Link to='/'>
                Главная
            </Link>
        </Menu.Item>
        <Menu.Item>
            <Link to='/404'>
                404
            </Link>
        </Menu.Item>
    </Menu>
)

export default MainMenu