import React from 'react'
import { func } from 'prop-types'

const AutoComplete = require('antd/lib/auto-complete')
require('antd/lib/auto-complete/style/css')

import brands from 'client/../config/brands'

class FirmsAutocomplete extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            currentBrands: []
        }
    }

    handleFirmSearch(val){
        this.props.onDataToForm(val)
        if(val.length == 1){
            this.setState({ currentBrands: brands[val] })            
        }
    }

    onFirmSelect(val) {
        this.props.onDataToForm(val)
    }

    render(){
        return (
            <AutoComplete
                dataSource={ this.state.currentBrands }
                onSelect={ e => this.onFirmSelect(e) }
                onSearch={ e => this.handleFirmSearch(e) }
                filterOption={(inputValue, option) => option.props.children.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1}
                placeholder='Начните печатать...'
            />
        )
    }
}

FirmsAutocomplete.propTypes = {
    onDataToForm: func.isRequired,
}

export default FirmsAutocomplete