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
        this.state ={
            position: 'relative'
        }
    }

    componentWillMount(){
        const { isMobile } = this.props
        if(!isMobile){
            window.onscroll = () => {
                const scrolled = window.pageYOffset || document.documentElement.scrollTop
                if(scrolled > 0){
                    this.setState({ position: 'fixed' })
                } else {
                    this.setState({ position: 'relative' })
                }
            }
        }        
    }

    render(){
        const { isMobile } = this.props
        return(
            <div
                id='header'
                className={ l.root }
                ref={ (el) => this.element = el }
                style={{ position: this.state.position }}
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
                    <MainMenu isMobile={ isMobile }  />    
                </Row>
            </div>
        )
    }
}