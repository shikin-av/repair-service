import React from 'react'

import Categories from 'client/site/components/Content/Categories/Categories.jsx'

export default class CategoriesPage extends React.Component {
    constructor(props){
        super(props)
    }

    render(){
        return (
            <div>
                <Categories />
            </div>
        )
    }
}