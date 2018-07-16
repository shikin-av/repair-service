import React from 'react'
import { func } from 'prop-types'

const Input = require('antd/lib/input')
require('antd/lib/input/style/css')

class SimpleInput extends React.Component {
    constructor(props){
        super(props)
    }

    render(){
        return (
            <Input onChange={ e => this.props.onDataToForm(e.target.value) }/>
        )
    }
}

SimpleInput.propTypes = {
    onDataToForm: func.isRequired
}

export default SimpleInput