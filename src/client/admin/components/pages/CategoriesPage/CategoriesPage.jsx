import React from 'react'
import { connect } from 'react-redux'
import { array } from 'prop-types'
import { Link } from 'react-router-dom'

import { 
    getCategories as getCategoriesSelector
} from 'client/admin/selectors/categories'

import {
    getCategories  as getCategoriesAction
} from 'client/admin/actions/categories'

const Collapse = require('antd/lib/collapse')
require('antd/lib/collapse/style/css')
const Panel = Collapse.Panel
const Button = require('antd/lib/button')
require('antd/lib/button/style/css')
const Spin = require('antd/lib/spin')
require('antd/lib/spin/style/css')

import List from 'client/admin/components/Content/List/List.jsx'

import l from './CategoriesPage.less'

class CategoriesPage extends React.Component {
    constructor(props){
        super(props)
    }

    componentWillMount(){
        this.props.getCategoriesAction()
    }

    render(){
        const { categories } = this.props
        if(categories){
            return (
                <div className={ l.root }>
                    <Link to='/categories/create'>
                        <Button className={ l.create }>+</Button>
                    </Link>
                    <List 
                        items={ categories } 
                        apiName='categories'
                        viewProperties={[
                            { value: 'image', type: 'image' },
                            { value: 'shortName', type: 'string' }
                        ]}
                        nameUrl='nameUrl'
                    />
                </div>
            )
        } else return ( <Spin/> )        
    }
}

const mapStateToProps = state => ({
    categories: getCategoriesSelector(state)
})

const mapDispatchToProps = {
    getCategoriesAction
}

CategoriesPage.propTypes = {
    categories: array
}

export default connect(mapStateToProps, mapDispatchToProps)(CategoriesPage)