import React from 'react'

import Categories from 'client/site/components/content/Categories/Categories.jsx'
import TextContent from 'client/site/components/content/TextContent/TextContent.jsx'

export default class Home extends React.Component {
    constructor(props){
        super(props)
    }

    render(){
        return (
            <div>
                <TextContent nameUrl='text1' />
                <Categories />
            </div>
        )
    }
}
