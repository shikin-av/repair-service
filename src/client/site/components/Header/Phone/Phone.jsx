import React from 'react'
import { connect } from 'react-redux'
import { object } from 'prop-types'
import device from 'current-device'

import {
    getCurrentCity as getCurrentCitySelector
} from 'client/site/selectors/cities'

import BigButton from 'client/site/components/content/BigButton/BigButton.jsx'

import l from './Phone.less'

const Phone = props => {
    
    const phoneTextToLink = text => {
        const regExpTrash = /[^\d]/g
        let result = text.replace(regExpTrash, '')
        const regExpPhone = /^((\+7|7|8)+([0-9]){10})$/g
        if(regExpPhone.test(result)){
            return result
        } else {
            return '+7' + result
        }
    }

    const { currentCity } = props
    if(currentCity && currentCity.hasOwnProperty('phone')){
        const isMobile = device.mobile()
        return (
            <div className={ l.root }>
                <BigButton 
                    href={ `tel:${ phoneTextToLink(currentCity.phone) }` }
                    icon='phone'
                    disabled={ isMobile ? false : true }
                >
                    { currentCity.phone }
                </BigButton>
            </div>
        )
    } else {
        return null
    }
}

const mapStateToProps = state => ({
    currentCity: getCurrentCitySelector(state)
})

const mapDispatchToProps = {}

Phone.propTypes = {
    currentCity: object,
}

export default connect(mapStateToProps, mapDispatchToProps)(Phone)