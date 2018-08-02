import React from 'react'
import { array, string } from 'prop-types'

import ContentList from 'client/admin/components/content/ContentList/ContentList'

class GetAll extends React.Component {
    constructor(props){
        super(props)
    }

    render(){
        const { orders, cityNameUrl } = this.props
        return (
            <ContentList
                items={ orders }
                apiName={ `orders/city/${ cityNameUrl }` }
                type='orders'
                viewProperties={[
                    { value: 'categoryShortName', type: 'string' },
                    { value: 'city', type: 'string' },
                    { value: 'dateToView', type: 'string' },
                    { value: 'id', type: 'string' },
                ]}
                nameUrl='id'
            />
        )
    }
}

GetAll.propTypes = {
    orders: array.isRequired,
    cityNameUrl:   string.isRequired
}

export default GetAll