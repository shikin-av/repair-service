import React from 'react'
import { connect } from 'react-redux'

//import { getCities as getCitiesAction } from '../../../admin/actions/cities'
//import { getCities as getCitiesSelector } from '../../../admin/selectors/cities'
import { getCities as getCitiesAction } from '../../actions/cities'
import { getCities as getCitiesSelector } from '../../selectors/cities'

class ChoiceCity extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            currentCity: null
        }
    }

    componentDidMount(){
        ymaps.ready(() => {
            const city = window.ymaps.geolocation.city
            this.setState({ currentCity: city })
        })
        this.props.getCitiesAction()
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