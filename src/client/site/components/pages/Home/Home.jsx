import React from 'react'

import Categories from 'client/site/components/content/Categories/Categories.jsx'

export default class Home extends React.Component {
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
