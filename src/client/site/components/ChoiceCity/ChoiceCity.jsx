import React from 'react'
import { connect } from 'react-redux'

import { getCities as getCitiesAction } from 'client/site/actions/cities'
import { getCities as getCitiesSelector } from 'client/site/selectors/cities'

class ChoiceCity extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            currentCity: null
        }
    }

    componentDidMount(){
        window.ymaps.ready(() => {
            const city = window.ymaps.geolocation.city
            this.setState({ currentCity: city })
        })
        if(!this.props.cities) this.props.getCitiesAction()
    }

    render(){
        const { cities } = this.props
        if(cities){
            return (
                <div>
                    <div>
                        <script src='https://api-maps.yandex.ru/2.0-stable/?load=package.standard&lang=ru-RU'></script>
                        <div id='map' style={{ width: '0px', height: '0px' }}></div>
                    </div>
                    {
                        cities.map((city, index) => {
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

export default connect(mapStateToProps, mapDispatchToProps)(ChoiceCity)