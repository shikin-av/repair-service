import React from 'react'
import { connect } from 'react-redux'
import _ from 'lodash'
import { array, object } from 'prop-types'

import { 
    getCities        as getCitiesAction,
    setCurrentCity   as setCurrentCityAction
} from 'client/site/actions/cities'
import { 
    getCities      as getCitiesSelector,
    getCurrentCity as getCurrentCitySelector
} from 'client/site/selectors/cities'

const Select = require('antd/lib/select')
require('antd/lib/select/style/css')
const Option = Select.Option

import l from './SelectCity.less'


class SelectCity extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            currentCity: null,
            selectShow: false,
        }
    }

    componentWillMount(){
        this.selectDefaultText = 'Выберите Ваш город'
    }

    componentDidMount(){
        window.ymaps.ready(() => {
            const currentCityLS = JSON.parse(localStorage.getItem('currentCity'))
            if(currentCityLS){
                this.props.setCurrentCityAction(currentCityLS)
            }
            
            this.props.getCitiesAction()
            .then(() => {
                if(currentCityLS){
                    this.setState({ 
                        currentCity: currentCityLS,
                    })
                } else {
                    const currentCity = _.find(this.props.cities, { name: window.ymaps.geolocation.city })
                    if(currentCity){
                        this.setState({ 
                            currentCity: currentCity,
                        })
                        this.props.setCurrentCityAction(currentCity)
                        localStorage.setItem('currentCity', JSON.stringify(currentCity))
                    } else {
                        this.setState({ selectShow: true })
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
            })
            this.selectShowToggle()
            this.props.setCurrentCityAction(currentCity)
            localStorage.setItem('currentCity', JSON.stringify(currentCity))
        }
    }

    selectShowToggle(){
        this.setState({ selectShow: !this.state.selectShow })
    }

    selectRender(cities=[], defaultValue=this.selectDefaultText){
        return (
            <Select 
                defaultValue={ defaultValue }
                onChange={ val => this.selectHandle(val) }
                className={ l.select }
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
        )
    }

    cityInfoRender(currentCity){
        return (
            <div className={ l.cityInfo }>
                <a className={ l.cityName }
                   onClick={ e => this.selectShowToggle() }
                >
                    { 'г.' + currentCity.name }
                </a>
                <br/>
                <span>{ currentCity.officeAddress }</span>
            </div>
        )
    }

    render(){
        const { cities } = this.props
        const { currentCity, selectShow } = this.state
        if(cities && currentCity && currentCity.name){
            return (
                <div className={ l.root }>
                    { !selectShow && this.cityInfoRender(currentCity) }   
                    { selectShow && this.selectRender(cities, this.selectDefaultText) }
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
    currentCity: object,
}

export default connect(mapStateToProps, mapDispatchToProps)(SelectCity)