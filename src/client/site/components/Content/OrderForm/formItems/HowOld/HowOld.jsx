import React from 'react'
import { func } from 'prop-types'

import Radio from 'client/site/components/content/Radio/Radio.jsx'

class HowOld extends React.Component {
    constructor(props){
        super(props)
    }

    onChange(val){
        this.props.onDataToForm(val)
    }

    render(){
        return (
            <Radio 
                name='howOld'
                items = {[
                    '0-2',
                    '3-5',
                    '6-10',
                    'больше 10'
                ]}
                onData={ val => this.onChange(val) }
                style='inline'
            />
        )
    }
}

HowOld.propTypes = {
    onDataToForm: func.isRequired
}

export default HowOld