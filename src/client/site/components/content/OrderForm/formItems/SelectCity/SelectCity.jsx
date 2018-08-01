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
            console.log('currentCity ', currentCity)
            this.onChange(currentCity.name)
        }
    }

    onChange(cityName){
        /*const { cities } = this.props
        console.log('cities ', cities)
        const selectedCityInd = _.findIndex(cities, city => {
            return city.name == cityName
        })
        console.log('selectedCity index', selectedCityInd)
        const selectedCity = cities[selectedCityInd]
        console.log('selectedCity ', selectedCity)

        const nameUrl = selectedCity.nameUrl
        */

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