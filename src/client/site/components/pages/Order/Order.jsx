import React from 'react'
import { connect } from 'react-redux'
import { object } from 'prop-types'

import { getCurrentCategory as getCurrentCategoryAction } from 'client/site/actions/categories'
import { getCurrentCategory as getCurrentCategorySelector } from 'client/site/selectors/categories'

import OrderForm from 'client/site/components/content/OrderForm/OrderForm.jsx'

const Row = require('antd/lib/row')
require('antd/lib/row/style/css')
const Col = require('antd/lib/col')
require('antd/lib/col/style/css')
const Icon = require('antd/lib/icon')
require('antd/lib/icon/style/css')

import l from './Order.less'

class OrderPage extends React.Component {
    constructor(props){
        super(props)
    }

    componentWillMount(){
        const { nameurl } = this.props.match.params
        this.props.getCurrentCategoryAction(nameurl)
    }

    stepRender({ title, description, color, last }){        
        return (
            <div className={ l.step } key={ Math.random() }>    
                <div style={ color ? { borderColor: color } : null }
                    className={ l.stepBlock }
                >
                    <strong>{ title }</strong>
                    <p>{ description }</p>
                </div>  
                {
                    !last &&
                    <Icon 
                        type='down' 
                        style={{ 
                            textAlign: 'center',
                            display: 'block'
                        }}
                    />
                }                          
            </div>
        )
    }

    render(){
        const { category } = this.props
        
        const steps = [
            { title: 'Заполните заявку', color: '#1890ff' },
            { title: 'Мы перезвоним Вам в течении 10-20 минут' },
            { title: 'Проконсультируем Вас по ремонту' },
            { title: 'Назовем примерную стоимость обслуживания' },
            { title: 'Отремонтируем поломку', color: '#26bd00' },
        ]

        if(category){
            return (
                <Row className={ l.root }>
                    <Col md={24} lg={16}>
                        <OrderForm category={ category } />
                    </Col>
                    <Col md={24} lg={8}>
                        <div>
                            {
                                steps.map((step, id) => {
                                    if(id == (steps.length - 1)){
                                        step.last = true
                                    }
                                    return this.stepRender(step)
                                })
                            }                            
                        </div>
                    </Col>
                </Row>
            )
        } else return null
    }
}

const mapStateToProps = state => ({
    category: getCurrentCategorySelector(state),
})

const mapDispatchToProps = {
    getCurrentCategoryAction
}

OrderPage.propTypes = {
    category: object,
}

export default connect(mapStateToProps, mapDispatchToProps)(OrderPage)