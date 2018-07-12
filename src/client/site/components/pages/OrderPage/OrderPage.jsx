import React from 'react'
import { connect } from 'react-redux'
import _ from 'lodash'
import { object } from 'prop-types'

import { getCurrentCategory as getCurrentCategoryAction } from 'client/site/actions/categories'
import { getCurrentCategory as getCurrentCategorySelector } from 'client/site/selectors/categories'

import Order from 'client/site/components/Content/Order/Order.jsx'

const Row = require('antd/lib/row')
require('antd/lib/row/style/css')
const Col = require('antd/lib/col')
require('antd/lib/col/style/css')

import l from './OrderPage.less'

class CategoryPage extends React.Component {
    constructor(props){
        super(props)
    }

    componentWillMount(){
        const { nameurl } = this.props.match.params
        this.props.getCurrentCategoryAction(nameurl)
    }

    render(){
        const { category } = this.props
        if(category){
            return (
                <Row>
                    <Col sm={24} md={12}>
                        <Order category={ category } />
                    </Col>
                    <Col sm={24} md={12}>
                    
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

CategoryPage.propTypes = {
    category: object,
}

export default connect(mapStateToProps, mapDispatchToProps)(CategoryPage)