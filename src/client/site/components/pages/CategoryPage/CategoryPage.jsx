import React from 'react'
import { connect } from 'react-redux'
import _ from 'lodash'
import { object } from 'prop-types'

import { getCurrentCategory as getCurrentCategoryAction } from 'client/site/actions/categories'
import { getCurrentCategory as getCurrentCategorySelector } from 'client/site/selectors/categories'

const Row = require('antd/lib/row')
require('antd/lib/row/style/css')
const Col = require('antd/lib/col')
require('antd/lib/col/style/css')

import l from './CategoryPage.less'

class CategoryPage extends React.Component {
    constructor(props){
        super(props)
    }

    componentWillMount(){
        const { nameurl } = this.props.match.params
        this.props.getCurrentCategoryAction(nameurl)
    }

    render(){
        const { nameurl } = this.props.match.params
        const { category } = this.props
        if(category && category.name){
            return (
                <div>
                    <h1>{ category.name }</h1>
                    <img src={ `/assets/imgs/categories/${ category.image }` }/>
                </div>
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