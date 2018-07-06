import React from 'react'
import { connect } from 'react-redux'
import _ from 'lodash'

import { getCities as getCitiesAction } from 'client/site/actions/cities'
import { getCities as getCitiesSelector } from 'client/site/selectors/cities'
import s from './SelectCity.scss'
console.log('Styles: ', s)

class SelectCity extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            ymapsCity: null,
            currentCity: null
        }
    }

    componentDidMount(){
        window.ymaps.ready(() => {
            this.setState({ ymapsCity: window.ymaps.geolocation.city })            
            this.props.getCitiesAction()
            .then(() => {
                const currentCity = _.find(this.props.cities, { name: this.state.ymapsCity })
                this.setState({ currentCity: currentCity.name })
            })
        })
        
        
    }

    render(){
        const { cities } = this.props
        const { currentCity } = this.state
        if(cities){
            return (
                <div className={ s.root }>
                    <h3>{ currentCity }</h3>
                    {
                        cities.map(city => {
                            return <p key={ Math.random() }>{ city.name }</p>
                        })
                    }
                </div>
            )
        } else { return null }
    }
}

const mapStateToProps = state => ({
    cities: getCitiesSelector(state)
})

const mapDispatchToProps = {
    getCitiesAction
}

export default connect(mapStateToProps, mapDispatchToProps)(SelectCity)