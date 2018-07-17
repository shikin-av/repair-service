import React from 'react'
import { connect } from 'react-redux'
import { array } from 'prop-types'

import { 
    getCategories as getCategoriesSelector,
    getCategory   as getCategorySelector
} from 'client/admin/selectors/categories'

import {
    getCategories  as getCategoriesAction,
    getCategory    as getCategoryAction,
    createCategory as createCategoryAction
} from 'client/admin/actions/categories'

const Collapse = require('antd/lib/collapse')
require('antd/lib/collapse/style/css')
const Panel = Collapse.Panel

class CategoriesPage extends React.Component {
    constructor(props){
        super(props)
    }

    componentWillMount(){
        this.props.getCategoriesAction()

        fetch(`http://localhost/admin/api/categories`, {
            method: 'GET'
        })
        .then(res => {
            console.log(res)
            //return res.json()
        })
    }

    componentDidMount(){
        //console.log(this.re)
    }

    render(){
        const { categories } = this.props
        console.log(categories)
        if(categories){
            return (
                <div>
                    <Collapse accordion>
                    {
                        categories.map( category => {
                            return (
                                <Panel
                                    key={ Math.random() }
                                    header={ category.name }
                                >
                                    <p>
                                        { category.name }
                                    </p>
                                </Panel>
                            )
                        })
                    }
                    </Collapse>
                </div>
            )
        } else return null        
    }
}

const mapStateToProps = state => ({
    categories: getCategoriesSelector(state),
})

const mapDispatchToProps = {
    getCategoriesAction
}

CategoriesPage.propTypes = {
    categories: array
}

export default connect(mapStateToProps, mapDispatchToProps)(CategoriesPage)