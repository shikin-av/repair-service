import React from 'react'
import { array, string } from 'prop-types'

import {
    editOrder as editOrderApi
} from 'client/admin/api/orders'
import ContentList from 'client/admin/components/content/ContentList/ContentList.jsx'

const Row = require('antd/lib/row')
require('antd/lib/row/style/css')
const Col = require('antd/lib/col')
require('antd/lib/col/style/css')
const message = require('antd/lib/message')
require('antd/lib/message/style/css')

import l from  'client/admin/components/style/GetAll.less'

class GetAll extends React.Component {
    constructor(props){
        super(props)
    }

    render(){
        const { orders, cityNameUrl, dateString } = this.props
        return (
            <div className={ l.root }>
                <ContentList>
                {
                    orders.map(order =>{
                        let statusElement = null
                        if(order.status == 'new'){
                            statusElement = (
                                <span style={{ color: 'red' }}>Новая</span>
                            )
                        } else if(order.status == 'working'){
                            statusElement = (
                                <span style={{ color: 'orange' }}>Выполняется</span>
                            )
                        } else if(order.status == 'complete'){
                            statusElement = (
                                <span style={{ color: 'green' }}>Завершена</span>
                            )
                        } else if(order.status == 'trash'){
                            statusElement = (
                                <span style={{ color: 'grey' }}>Удалена</span>
                            )
                        }
                        return {
                            element: ( 
                                <Row key={ Math.random() } className={ l.row }>
                                    <Col sm={24} md={4}>    
                                        <span>{ order.categoryShortName }</span>
                                    </Col>
                                    <Col sm={24} md={4}>
                                        { statusElement }
                                    </Col>
                                    <Col sm={24} md={4}>    
                                        <span>{ order.id }</span>
                                    </Col>
                                    <Col sm={24} md={4}>    
                                        <span>{ order.dateToView }</span>
                                    </Col>
                                    <Col sm={24} md={4}>    
                                        <span>{ order.city }</span>
                                    </Col>
                                </Row>
                            ),
                            editLink: `/orders/date/${ order.dateToLink }/id/${ order.id }`
                        }    
                    })
                }
                </ContentList>
            </div>
        )
    }
}

GetAll.propTypes = {
    orders:      array.isRequired,
    cityNameUrl: string.isRequired,
    dateString:  string
}

export default GetAll
