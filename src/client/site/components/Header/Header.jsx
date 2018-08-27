import React from 'react'

import SelectCity from 'client/site/components/Header/SelectCity/SelectCity.jsx'
import MainMenu from 'client/site/components/Header/MainMenu/MainMenu.jsx'
import Logo from 'client/site/components/Header/Logo/Logo.jsx'
import Phone from 'client/site/components/Header/Phone/Phone.jsx'

const Row = require('antd/lib/row')
require('antd/lib/row/style/css')
const Col = require('antd/lib/col')
require('antd/lib/col/style/css')

import l from './Header.less'

const Header = props => (
    <div
        id='header'
        className={ l.root }                
    >                
        <Row>
            <div className='wrapper' style={{ paddingBottom: '0px' }}>
                <Col sm={24} md={8}>
                    <Logo />
                </Col>
                <Col sm={24} md={8}>
                    <SelectCity />
                </Col>
                <Col sm={24} md={8}>
                    <Phone />
                </Col>
            </div>
        </Row>
        <Row>
            <MainMenu isMobile={ props.isMobile }  />    
        </Row>
    </div>
)

export default Header