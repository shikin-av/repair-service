import React from 'react'
import { connect } from 'react-redux'
import { object } from 'prop-types'

import {
    getCurrentCity as getCurrentCitySelector
} from 'client/site/selectors/cities'

import Categories from 'client/site/components/content/Categories/Categories.jsx'
import TextContent from 'client/site/components/content/TextContent/TextContent.jsx'
import BigButton from 'client/site/components/content/BigButton/BigButton.jsx'

const Row = require('antd/lib/row')
require('antd/lib/row/style/css')
const Col = require('antd/lib/col')
require('antd/lib/col/style/css')

import l from './Home.less'

const Home = props => {    
    const { currentCity } = props
    return (
        <div className={ l.root }>
            <h1>
                Ремонт бытовой техники
                { 
                    (currentCity && currentCity.hasOwnProperty('name'))
                    ? ` в г.${ currentCity.name }` : ''
                }
            </h1>
            <div className={ `center ${ l.textBlock }` }>                    
                <strong>У Вас что-то сломалось?</strong><br/>
                <strong className='super-strong'>Мы починим!</strong><br/>
                <strong>Быстро</strong>
                <strong>Качественно</strong>
                <strong>Недорого</strong><br/>

                <BigButton href='/#/categories'>
                    <strong>Оформите заявку</strong><br/>
                    и вам перезвонят!                            
                </BigButton>                        
            </div>
            <h2>К вашим услугам мастера различного профиля:</h2>
            <Categories />                
            <Row className={ l.whyWe }>
                <h3>Почему выбирают именно нас:</h3>
                <Col sm={24} md={8}>
                    <TextContent nameUrl='why-we-1' />
                </Col>
                <Col sm={24} md={8}>
                    <TextContent nameUrl='why-we-2' />
                </Col>
                <Col sm={24} md={8}>
                    <TextContent nameUrl='why-we-3' />
                </Col>
            </Row>
        </div>
    )
}

const mapStateToProps = state => ({
    currentCity: getCurrentCitySelector(state)
})

const mapDispatchToProps = {}

Home.propTypes = {
    currentCity: object,
}

export default connect(mapStateToProps, mapDispatchToProps)(Home)