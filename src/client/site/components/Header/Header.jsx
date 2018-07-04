import React from 'react'

import ChoiceCity from '../ChoiceCity/ChoiceCity.jsx'

export default class Header extends React.Component {
    constructor(props){
        super(props)
    }

    render(){
        return(
            <div>
                <ChoiceCity />
            </div>
        )
    }
}