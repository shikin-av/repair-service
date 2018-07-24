import React from 'react'
//import { connect } from 'react-redux'
//import { array } from 'prop-types'
import { Link } from 'react-router-dom'

/*import { 
    getCategories as getCategoriesSelector
} from 'client/admin/selectors/categories'

import {
    getCategories  as getCategoriesAction
} from 'client/admin/actions/categories'
*/

import { getCategories as getCategoriesApi } from 'client/admin/api/categories'

const Collapse = require('antd/lib/collapse')
require('antd/lib/collapse/style/css')
const Panel = Collapse.Panel
const Button = require('antd/lib/button')
require('antd/lib/button/style/css')
const Spin = require('antd/lib/spin')
require('antd/lib/spin/style/css')

import ContentList from 'client/admin/components/Content/ContentList/ContentList.jsx'

import l from './CategoriesPage.less'

class CategoriesPage extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            categories: []
        }
    }

    componentWillMount(){
        //this.props.getCategoriesAction()
        try {
            return getCategoriesApi()
            .then(categories => {
                this.setState({ categories: categories })
            })

        } catch(err) {
            console.log(`ERROR ${err.stack}`)
        }
    }

    render(){
        //const { categories } = this.props
        const { categories } = this.state
        if(categories){
            return (
                <div className={ l.root }>
                    <Link to='/categories/create'>
                        <Button className={ l.create }>+</Button>
                    </Link>
                    <ContentList 
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

/*const mapStateToProps = state => ({
    categories: getCategoriesSelector(state)
})

const mapDispatchToProps = {
    getCategoriesAction
}*/
/*
CategoriesPage.propTypes = {
    categories: array
}*/

//export default connect(mapStateToProps, mapDispatchToProps)(CategoriesPage)
export default CategoriesPage