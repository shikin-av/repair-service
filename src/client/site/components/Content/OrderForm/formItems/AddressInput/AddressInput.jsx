import React from 'react'
import { func, string } from 'prop-types'

const Input = require('antd/lib/input')
require('antd/lib/input/style/css')

import l from './AddressInput.less'

class AddressInput extends React.Component {
    constructor(props){
        super(props)
    }

    componentDidMount(){
        const { city } =  this.props
        window.ymaps.ready(() => {            
            if(city){
                this.setSuggetsViewer(city)                
            }
        })
    }

    setSuggetsViewer(city){     // address autocomplite        
        this.suggestOptions = {}
        if(city){               // search for one city            
            this.suggestOptions.provider = {
                suggest: ((req, options) => {
                    return ymaps.suggest(`${ city }, ${ req }`)
                })
            }
        }        
        const suggestView = new ymaps.SuggestView('addressInput', this.suggestOptions)
        suggestView.events.add('select', e => {
            const address = e.originalEvent.item.displayName
            this.onChange(address)
        })
    }

    componentWillReceiveProps(nextProps){
        const { city } = this.props
        if(city != nextProps.city){
            this.setSuggetsViewer(nextProps.city)
        }
    }

    onChange(val){
        this.props.onDataToForm(val)
    }

    render(){
        return (
            <Input
                id='addressInput'
                onChange={ e => this.onChange(e.target.value) }
                placeholder='Начните печатать...'
            />
        )
    }
}

AddressInput.propTypes = {
    onDataToForm: func.isRequired,
    city: string
}

export default AddressInput