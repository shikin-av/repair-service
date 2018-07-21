import React from 'react'
import { array, string } from 'prop-types'
import { Link } from 'react-router-dom'

import l from './List.less'

const Row = require('antd/lib/row')
require('antd/lib/row/style/css')
const Col = require('antd/lib/col')
require('antd/lib/col/style/css')
const Icon = require('antd/lib/icon')
require('antd/lib/icon/style/css')

class List extends React.Component {
    constructor(props){
        super(props)
    }

    itemRender(item){
        const { viewProperties, apiName, nameUrl } = this.props
        return(
            <li key={ Math.random() } >
                <Link to={ `/${apiName}/${item[nameUrl]}` }>
                    <Row>
                        <Col sm={24} md={18}>
                            
                                {
                                    viewProperties.map(prop => {
                                        switch(prop.type){
                                            case 'string':
                                                return ( <span key={ Math.random() }>{ item[prop.value] }</span> )
                                            case 'image':
                                                return( <img key={ Math.random() } src={ `/assets/imgs/${apiName}/${item[prop.value]}` }/> )
                                            default: return null
                                        }
                                    })
                                }
                            
                        </Col>
                        <Col sm={24} md={6}>
                            <span className={ l.right }>
                                <Link to={ `/${apiName}/${item[nameUrl]}` }>
                                    <Icon type='edit' />
                                </Link>
                                <Link to={'/'}>
                                    <Icon type='delete' />
                                </Link>
                            </span>                    
                        </Col>
                    </Row>
                </Link>
            </li>
        )
    }

    render(){
        const { items } = this.props
        return (
            <ul className={ l.root }>
                {
                    items.map(item => {
                        return this.itemRender(item)
                    })
                }
            </ul>
        )
    }
}

List.propTypes = {
    items:          array.isRequired,
    apiName:        string.isRequired,
    viewProperties: array.isRequired,
    nameUrl:        string.isRequired
}

export default List

/*
Use:

<List 
    items={ categories } 
    apiName='categories'
    viewProperties={[
        { value: 'image', type: 'image' },
        { value: 'shortName', type: 'string' }
    ]}
    nameUrl='nameUrl'
/>
*/