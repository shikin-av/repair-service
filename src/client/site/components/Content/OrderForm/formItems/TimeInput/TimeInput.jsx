import React from 'react'
import { func } from 'prop-types'

const InputNumber = require('antd/lib/input-number')
require('antd/lib/input-number/style/css')

class TimeInput extends React.Component {
    constructor(props){
        super(props)
    }

    handleTimeChange(val){
        this.props.onDataToForm(`${ val }:00`) 
    }

    render(){
        return (
            <InputNumber
                min={9}
                max={18}
                placeholder='время'
                formatter={val => `${val}${val && ':00'}` }
                parser={val => val.replace(':00', '')}
                onChange={ val => this.handleTimeChange(val) }
            />
        )
    }
}

TimeInput.propTypes = {
    onDataToForm: func.isRequired,
}

export default TimeInput