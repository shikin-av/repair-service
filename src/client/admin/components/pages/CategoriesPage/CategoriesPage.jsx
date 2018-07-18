import React from 'react'
import { connect } from 'react-redux'
import { array } from 'prop-types'

import { 
    getCategories as getCategoriesSelector
} from 'client/admin/selectors/categories'

import {
    getCategories  as getCategoriesAction
} from 'client/admin/actions/categories'

const Spin = require('antd/lib/spin')
require('antd/lib/spin/style/css')
const Collapse = require('antd/lib/collapse')
require('antd/lib/collapse/style/css')
const Panel = Collapse.Panel

//import List from 'client/admin/components/Content/List/List.jsx'
import Edit from 'client/admin/components/Content/edits/CategoryEdit/CategoryEdit.jsx'

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
                <Collapse accordion>
                    { categories.map( category => (
                        <Panel
                            key={ Math.random() }
                            header={ category.shortName }
                        >
                            <Edit category={ category } />
                        </Panel> 
                    )) }
                </Collapse>
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