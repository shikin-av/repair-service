import React from 'react'
import { func, string } from 'prop-types'

const Input = require('antd/lib/input')
require('antd/lib/input/style/css')
const { TextArea } = Input

class Description extends React.Component {
    constructor(props){
        super(props)
    }

    onChange(e){
        this.props.onDataToForm(e.target.value)
    }

    render(){
        return (
            <TextArea 
                rows={4}
                onChange={ e => this.onChange(e) }
                placeholder='Своими словами: что происходит или что нужно сделать?'
                defaultValue={ this.props.defaultValue }
            />
        )
    }
}

Description.propTypes = {
    onDataToForm: func.isRequired,
    defaultValue: string
}

export default Description