import React from 'react'
import { func } from 'prop-types'

const Input = require('antd/lib/input')
require('antd/lib/input/style/css')

import l from './AddressInput.less'

class AddressInput extends React.Component {
    constructor(props){
        super(props)
    }

    componentDidMount(){
        window.ymaps.ready(() => {
            // address autocomplite
            const suggestView = new ymaps.SuggestView('addressInput')
            suggestView.events.add('select', e => {
                const address = e.originalEvent.item.displayName
                this.props.onDataToForm(address)
            })
        })
    }

    onChange(e){
        this.props.onDataToForm(e.target.value)
    }

    render(){
        return (
            <Input
                id='addressInput'
                onChange={ e => this.onChange(e) }
                placeholder='Начните печатать...'
            />
        )
    }
}

AddressInput.propTypes = {
    onDataToForm: func.isRequired
}

export default AddressInput