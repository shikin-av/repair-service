import React from 'react'
import { Link } from 'react-router-dom'
import { func } from 'prop-types'

const Icon = require('antd/lib/icon')
require('antd/lib/icon/style/css')
const List = require('antd/lib/list')
require('antd/lib/list/style/css')
const Popconfirm = require('antd/lib/popconfirm')
require('antd/lib/popconfirm/style/css')
const Tooltip = require('antd/lib/tooltip')
require('antd/lib/tooltip/style/css')

import l from './ContentList.less'

class ContentList extends React.Component {
    constructor(props){
        super(props)
    }

    deleteItem(identificator){
        this.props.onDelete(identificator)
    }

    render(){
        return (
            <List
                className={ l.root }
                itemLayout='horizontal'
                pagination={{
                    pageSize: 8,
                }}
            >
            {
                this.props.children.map(item => {
                    return (
                        <List.Item
                            key={ Math.random() }
                            className={ l.listItem }
                            actions={[
                                ( 
                                    item.editLink &&
                                    <Tooltip title='Открыть в новом окне'>
                                        <Link to={ item.editLink } target='_blank'>
                                            <Icon type='edit' />
                                        </Link>
                                    </Tooltip>
                                )
                                ,
                                (
                                    item.deleteText &&
                                    <Tooltip title='Удалить'>
                                        <Popconfirm
                                            title={ item.deleteText }
                                            onConfirm={ () => this.deleteItem(item.identificator) }
                                            onCancel={ null }
                                            okText="Да"
                                            cancelText="Нет"
                                        >
                                            <Icon type='delete' />
                                        </Popconfirm>
                                    </Tooltip>
                                )
                            ]}
                        >
                        {   item.editLink ?
                            <Link to={ item.editLink }>{ item.element }</Link>
                            : item.element
                        }
                        </List.Item>
                    )
                })
            }
            </List>
        )
    }	
}

ContentList.propTypes = {
    onDelete: func.isRequired
}

export default ContentList