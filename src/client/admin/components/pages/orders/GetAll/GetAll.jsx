import React from 'react'
import { array, string } from 'prop-types'

import ContentList from 'client/admin/components/content/ContentList/ContentList.jsx'
import OrdersFilter from 'client/admin/components/content/OrdersFilter/OrdersFilter.jsx'

class GetAll extends React.Component {
    constructor(props){
        super(props)
    }

    render(){
        const { orders, cityNameUrl, dateString } = this.props
        return (
            <div>
                <OrdersFilter
                    cityNameUrl={ cityNameUrl }
                    dateString={ dateString }
                />
                <ContentList
                    items={ orders }
                    apiName='orders'
                    type='orders'
                    viewProperties={[
                        { value: 'categoryShortName', type: 'string' },
                        { value: 'status', type: 'string' },
                        { value: 'city', type: 'string' },
                        { value: 'dateToView', type: 'string' },
                        { value: 'id', type: 'string' },
                    ]}
                    nameUrl='id'
                />
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
