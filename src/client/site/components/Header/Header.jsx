import React from 'react'

import SelectCity from 'client/site/components/Header/SelectCity/SelectCity.jsx'

export default class Header extends React.Component {
    constructor(props){
        super(props)
    }

    render(){
        return(
            <div>
                <SelectCity />
            </div>
        )
    }
}