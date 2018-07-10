import React from 'react'
import { connect } from 'react-redux'
import _ from 'lodash'
import { array } from 'prop-types'

import { getCategories as getCategoriesAction } from 'client/site/actions/categories'
import { getCategories as getCategoriesSelector } from 'client/site/selectors/categories'

import CategoryItem from 'client/site/components/Content/CategoryItem/CategoryItem.jsx'

const Row = require('antd/lib/row')
require('antd/lib/row/style/css')
const Col = require('antd/lib/col')
require('antd/lib/col/style/css')

import l from './Categories.less'

class Categories extends React.Component {
    constructor(props){
        super(props)
    }

    componentWillMount(){
        this.props.getCategoriesAction()
    }

    render(){
        const { categories } = this.props
        return (
            <Row gutter={16}>
                {
                    categories.map(category => (
                        <Col
                            sm={24}
                            md={6}
                            key={ Math.random() }
                        >
                            <CategoryItem category={ category } />
                        </Col>
                    ))
                }
            </Row>
        )
    }
}

const mapStateToProps = state => ({
    categories: getCategoriesSelector(state),
})

const mapDispatchToProps = {
    getCategoriesAction
}

Categories.propTypes = {
    categories: array,
}

export default connect(mapStateToProps, mapDispatchToProps)(Categories)