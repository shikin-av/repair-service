import React from 'react'
import { array, string } from 'prop-types'
import { Link } from 'react-router-dom'

import config from 'client/../config/client'

import l from './ContentList.less'

const Row = require('antd/lib/row')
require('antd/lib/row/style/css')
const Col = require('antd/lib/col')
require('antd/lib/col/style/css')
const Icon = require('antd/lib/icon')
require('antd/lib/icon/style/css')
const List = require('antd/lib/list')
require('antd/lib/list/style/css')
const Avatar = require('antd/lib/avatar')
require('antd/lib/avatar/style/css')

class ContentList extends React.Component {
    constructor(props){
        super(props)
    }

    /*itemRender(item){
        const { viewProperties, apiName, nameUrl } = this.props
        return(
            <List.Item 
                key={ Math.random() }
                className={ l.listItem }
            >
                <Link to={ `/${apiName}/${item[nameUrl]}` }>
                    <Row>
                        <Col sm={24} md={18}>
                            
                                {
                                    viewProperties.map(prop => {
                                        switch(prop.type){
                                            case 'string':
                                                return ( <span key={ Math.random() }>{ item[prop.value] }</span> )
                                            case 'image':
                                                return( <img key={ Math.random() } src={ `${ config.assetsPath }/imgs/${ item[prop.value] }` }/> )
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
            </List.Item>
        )
    }*/
    itemRender(item){
        const { viewProperties, apiName, nameUrl } = this.props
        return(
            <List.Item 
                key={ Math.random() }
                className={ l.listItem }
                actions={
                    [
                        <Link to={ `/${apiName}/${item[nameUrl]}` }>
                            <Icon type='edit' />
                        </Link>, 
                        <Link to={'/'}>
                            <Icon type='delete' />
                        </Link>
                    ]
                }
            >
                <Link to={ `/${apiName}/${item[nameUrl]}` }>
                {
                    viewProperties.map(prop => {
                        switch(prop.type){
                            case 'string':
                                return ( <span key={ Math.random() }>{ item[prop.value] }</span> )
                            case 'image':
                                return( <img key={ Math.random() } src={ `${ config.assetsPath }/imgs/${ item[prop.value] }` }/> )
                            default: return null
                        }
                    })
                }
                </Link>
            </List.Item>
        )
    }
    /*
        
    */

    render(){
        const { items } = this.props
        return (
            <List
                className={ l.root }
                itemLayout='horizontal'
                pagination={{
                    onChange: (page) => {
                        console.log(page)
                    },
                    pageSize: 8,
                }}
                dataSource={ items }
                renderItem={ item => this.itemRender(item) }
            />
        )
    }
}

ContentList.propTypes = {
    items:          array.isRequired,
    apiName:        string.isRequired,
    viewProperties: array.isRequired,
    nameUrl:        string.isRequired
}

export default ContentList

/*
Use:

<ContentList 
    items={ categories } 
    apiName='categories'
    viewProperties={[
        { value: 'image', type: 'image' },
        { value: 'shortName', type: 'string' }
    ]}
    nameUrl='nameUrl'
/>
*/