import React from 'react'

import Categories from 'client/site/components/content/Categories/Categories.jsx'

export default class CategoriesPage extends React.Component {
    constructor(props){
        super(props)
    }

    render(){
        return (
            <div>
                <h1>Выберите технику:</h1>
                <Categories />
            </div>
        )
    }
}
