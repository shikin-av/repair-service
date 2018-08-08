import React from 'react'
import { func, number } from 'prop-types'

const InputNumber = require('antd/lib/input-number')
require('antd/lib/input-number/style/css')

import config from 'config/client'

class TimeInput extends React.Component {
    constructor(props){
        super(props)        
    }

    isNumber(val){
        const int = parseInt(val) 
        if(!isNaN(int)){
            return true
        } else return false
    }

    handleTimeChange(val){
        this.props.onDataToForm(`${ val }:00`) 
    }

    render(){      
        const { defaultValue } = this.props
        console.log('TimeInput defaultValue', defaultValue)
        return (
            <InputNumber
                min={config.workTime.begin}
                max={config.workTime.end}
                placeholder='время'
                formatter={val => `${val}${val && ':00'}` }
                parser={val => val.replace(':00', '')}
                onChange={ val => this.handleTimeChange(val) }
                defaultValue={ (defaultValue && this.isNumber(defaultValue)) ? parseInt(defaultValue) : null }
            />
        )
    }
}

TimeInput.propTypes = {
    onDataToForm: func.isRequired,
    defaultValue: number
}

export default TimeInput