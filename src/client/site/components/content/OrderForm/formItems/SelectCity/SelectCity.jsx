import React from 'react'
import { func, array, object } from 'prop-types'
import _ from 'lodash'

const Select = require('antd/lib/select')
require('antd/lib/select/style/css')
const Option = Select.Option

class SelectCity extends React.Component {
    constructor(props){
        super(props)
    }

    componentDidMount(){
        const { currentCity } = this.props
        if(currentCity){
            this.onChange(currentCity.name)
        }
    }

    onChange(cityName){
        this.props.onDataToForm(cityName)
    }

    render(){
        const { cities, currentCity } = this.props        
        if(cities && currentCity && currentCity.name){
            return (
                <Select 
                    onChange={ val => this.onChange(val) }
                    value={ currentCity.name }
                >
                    { 
                        cities.map(city => (
                            <Option 
                                key={ city.nameUrl }
                                value={ city.name }
                            >{ city.name }</Option>
                        )) 
                    }
                </Select>
            )
        } else return null
    }
}

SelectCity.propTypes = {
    onDataToForm: func.isRequired,
    cities:       array.isRequired,
    currentCity:  object
}

export default SelectCity