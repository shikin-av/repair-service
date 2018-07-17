import React from 'react'
import { func, string } from 'prop-types'

const Input = require('antd/lib/input')
require('antd/lib/input/style/css')

class SimpleInput extends React.Component {
    constructor(props){
        super(props)
    }

    render(){
        const { placeholder } = this.props
        return (
            <Input 
                onChange={ e => this.props.onDataToForm(e.target.value) }
                placeholder={ placeholder ? placeholder : null }
            />
        )
    }
}

SimpleInput.propTypes = {
    onDataToForm: func.isRequired,
    placeholder: string
}

export default SimpleInput