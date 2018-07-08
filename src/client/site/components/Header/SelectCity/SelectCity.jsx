import React from 'react'
import { connect } from 'react-redux'
import _ from 'lodash'
import { array } from 'prop-types'

import { 
    getCities        as getCitiesAction,
    setCurrentCity   as setCurrentCityAction
} from 'client/site/actions/cities'
import { 
    getCities      as getCitiesSelector,
    getCurrentCity as getCurrentCitySelector
} from 'client/site/selectors/cities'

//const Button = require('antd/lib/button/button')
//require('antd/lib/button/style/index.css')
const Select = require('antd/lib/select')
require('antd/lib/select/style/css')
const Option = Select.Option

import l from './SelectCity.less'


class SelectCity extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            currentCity: null,
            currentCityName: 'Выберите Ваш город'
        }
    }

    componentDidMount(){
        window.ymaps.ready(() => {
            const currentCityLS = JSON.parse(localStorage.getItem('currentCity'))
            if(currentCityLS) this.props.setCurrentCityAction(currentCityLS)
            
            this.props.getCitiesAction()
            .then(() => {
                if(currentCityLS){
                    this.setState({ 
                        currentCity: currentCityLS,
                        currentCityName: currentCityLS.name
                    })
                } else {
                    const currentCity = _.find(this.props.cities, { name: window.ymaps.geolocation.city })
                    if(currentCity){
                        this.setState({ 
                            currentCity: currentCity,
                            currentCityName: currentCity.name
                        })
                        this.props.setCurrentCityAction(currentCity)
                        localStorage.setItem('currentCity', JSON.stringify(currentCity))
                    }
                }
            })
        })
    }

    selectHandle(val){
        const currentCity = _.find(this.props.cities, { name: val })
        if(currentCity){
            this.setState({ 
                currentCity: currentCity,
                currentCityName: currentCity.name
            })
            this.props.setCurrentCityAction(currentCity)
            localStorage.setItem('currentCity', JSON.stringify(currentCity))
        }
    }

    render(){
        const { cities } = this.props
        const { currentCity, currentCityName } = this.state
        if(cities){
            return (
                <div className={ l.root }>
                    <h3>{ currentCityName }</h3>
                    <Select 
                        defaultValue={ currentCityName }
                        onChange={val => this.selectHandle(val) }
                    >
                        {
                            cities.map(city => {
                            return ( 
                                <Option 
                                    value={ city.name }
                                    key={ Math.random() }
                                >{ city.name }</Option> )
                            })
                        }
                    </Select>
                </div>
            )
        } else { return null }
    }
}

const mapStateToProps = state => ({
    cities: getCitiesSelector(state),
    currentCity: getCurrentCitySelector(state)
})

const mapDispatchToProps = {
    getCitiesAction,
    setCurrentCityAction
}

SelectCity.propTypes = {
    cities: array,
}

export default connect(mapStateToProps, mapDispatchToProps)(SelectCity)