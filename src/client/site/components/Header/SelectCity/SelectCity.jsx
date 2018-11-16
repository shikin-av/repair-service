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

import SelectCityInput from 'client/site/components/content/OrderForm/formItems/SelectCity/SelectCity.jsx'

import l from './SelectCity.less'


class SelectCity extends React.Component {
    constructor(props){
        super(props)
        this.state = {
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
                if(!currentCityLS){
                    let ymCity = null                    
                    if(ymaps.geolocation){
                        ymaps.geolocation.get({ autoGeocode: true })
                        .then( res => {
                            ymCity = res.geoObjects.get(0).properties.getAll().name
                            const currentCity = _.find(this.props.cities, { name: ymCity })
                            if(currentCity){
                                this.props.setCurrentCityAction(currentCity)
                                localStorage.setItem('currentCity', JSON.stringify(currentCity))
                            } else {
                                this.setState({ selectShow: true })
                            }
                        })
                    } else {    // if blocked on browser                        
                        this.setState({ selectShow: true })
                    }
                }
            })
        })
    }

    componentWillReceiveProps(nextProps){
        const oldCurrentCity = this.props.currentCity
        const newCurrentCity = nextProps.currentCity
        if(newCurrentCity != oldCurrentCity){
            this.setState({ selectShow: false })
        }
    }

    selectHandle(val){
        const currentCity = _.find(this.props.cities, { name: val })
        if(currentCity){
            this.selectShowToggle()
            this.props.setCurrentCityAction(currentCity)
            localStorage.setItem('currentCity', JSON.stringify(currentCity))
        }
    }

    selectShowToggle(){
        this.setState({ selectShow: !this.state.selectShow })
    }

    render(){
        const { cities } = this.props
        const { selectShow } = this.state
        const { currentCity } = this.props
        if(cities){
            return (
                <div className={ l.root }>
                    { 
                        !selectShow && currentCity && currentCity.hasOwnProperty('name') && 
                        <div className={ l.cityInfo }>
                            <span className={l.question}>Ваш город</span>
                            <a className={ l.cityName }
                            onClick={ e => this.selectShowToggle() }
                            >
                                { currentCity.name }
                            </a>
                            <br/>
                            <span>{ currentCity.officeAddress }</span>
                        </div>
                    }   
                    { 
                        selectShow && 
                        <Select
                            defaultValue={ this.selectDefaultText }
                            onChange={ val => this.selectHandle(val) }
                            className={ l.select }
                        >
                            {
                                cities.map(city => {
                                return ( 
                                    <Option 
                                        value={ city.name }
                                        key={ city.nameUrl }
                                    >{ city.name }</Option> )
                                })
                            }
                        </Select>
                    }

                </div>
            )
        } else return null
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