import React from 'react'
import { array, string, func } from 'prop-types'
import { Link } from 'react-router-dom'

import config from 'client/../config/client'

import l from './ContentList.less'

const Icon = require('antd/lib/icon')
require('antd/lib/icon/style/css')
const List = require('antd/lib/list')
require('antd/lib/list/style/css')
const Popconfirm = require('antd/lib/popconfirm')
require('antd/lib/popconfirm/style/css')

class ContentList extends React.Component {
    constructor(props){
        super(props)
    }

    deleteItem(nameUrl){
        this.props.onDelete(nameUrl)
    }
    
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
                        <Popconfirm 
                            title={ `Удалить ${ item['shortName'] || item['name'] || '' } ?` } 
                            onConfirm={ e => this.deleteItem(item[nameUrl]) } 
                            onCancel={ null } 
                            okText="Да" 
                            cancelText="Нет"
                        >
                            <Icon type='delete' />
                        </Popconfirm>
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
    nameUrl:        string.isRequired,
    onDelete:       func.isRequired
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