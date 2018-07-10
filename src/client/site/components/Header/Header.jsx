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

export default class Header extends React.Component {
    constructor(props){
        super(props)
    }

    componentDidMount(){
        // for content margin-top
        const height = this.element.clientHeight
        this.props.onHeaderHeight(height)
    }

    render(){
        const { isMobile } = this.props
        return(
            <div
                id='header'
                className={ l.root }
                ref={ (el) => this.element = el }
                style={ isMobile ? null : {position: 'fixed'} }
            >
                <Row>
                    <div className={ l.wrapper }>
                        <Col sm={24} md={8}>
                            <Logo isMobile={ isMobile } />
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
                    <MainMenu isMobile={ isMobile }  />    
                </Row>
            </div>
        )
    }
}