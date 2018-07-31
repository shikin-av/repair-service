import React from 'react'
import { func, array } from 'prop-types'

const Checkbox = require('antd/lib/checkbox')
require('antd/lib/checkbox/style/css')
const CheckboxGroup = Checkbox.Group

import l from './Problems.less'

class Problems extends React.Component {
    constructor(props){
        super(props)
    }    
    
    onChange(values){
        this.props.onDataToForm(values)
    }
    
    render(){
        const { problems } = this.props
        if(problems){
            return (
                <CheckboxGroup
                    options={ problems.map(problem => {
                        return {
                            label: problem.value,
                            value: problem.value
                        }
                    })}
                    onChange={ values => this.onChange(values) }
                    className={ l.root }
                />
            )
        } else return null
        
    }
}

Problems.propTypes = {
    problems:     array.isRequired,
    onDataToForm: func.isRequired
}

export default Problems