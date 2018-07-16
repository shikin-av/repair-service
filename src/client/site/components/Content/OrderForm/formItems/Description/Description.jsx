import React from 'react'
import { func } from 'prop-types'

const Input = require('antd/lib/input')
require('antd/lib/input/style/css')
const { TextArea } = Input

import l from './Description.less'

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
            />
        )
    }
}

Description.propTypes = {
    onDataToForm: func.isRequired
}

export default Description