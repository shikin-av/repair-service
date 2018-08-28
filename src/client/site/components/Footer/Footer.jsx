import React from 'react'
import { connect } from 'react-redux'
import { object } from 'prop-types'

import {
    getCurrentCity as getCurrentCitySelector
} from 'client/site/selectors/cities'

import BigButton from 'client/site/components/content/BigButton/BigButton.jsx'
import TextContent from 'client/site/components/content/TextContent/TextContent.jsx'

const Row = require('antd/lib/row')
require('antd/lib/row/style/css')
const Col = require('antd/lib/col')
require('antd/lib/col/style/css')
const Icon = require('antd/lib/icon')
require('antd/lib/icon/style/css')

import l from './Footer.less'

const Footer = props => {
    const { currentCity } = props

    return (
        <Row className={ l.root }>
            <h3>Остались вопросы?</h3>
            <BigButton href='/#/categories'>
                <strong>Оставьте заявку</strong><br/>
                и мы вам перезвоним!                            
            </BigButton> 
            {
                currentCity && currentCity.hasOwnProperty('phone') && currentCity.hasOwnProperty('officeAddress') &&
                <div className='center'>                    
                    <h3 style={{ marginBottom: 0 }}>
                        <Icon type='phone'/>{ currentCity.phone }
                    </h3>
                    <strong>{ currentCity.officeAddress }</strong><br/><br/>
                </div>
            }
        </Row>
    )
}

const mapStateToProps = state => ({
    currentCity: getCurrentCitySelector(state)
})

const mapDispatchToProps = {}

Footer.propTypes = {
    currentCity: object,
}

export default connect(mapStateToProps, mapDispatchToProps)(Footer)

