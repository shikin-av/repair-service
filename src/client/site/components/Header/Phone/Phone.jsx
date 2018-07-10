import React from 'react'
import { connect } from 'react-redux'
import { array, object } from 'prop-types'

import {
    getCurrentCity as getCurrentCitySelector
} from 'client/site/selectors/cities'

const Button = require('antd/lib/button')
require('antd/lib/button/style/css')

import l from './Phone.less'

class Phone extends React.Component {
    constructor(props){
        super(props)
    }

    phoneTextToLink(text){
        const regExpTrash = /[^\d]/g
        let result = text.replace(regExpTrash, '')
        const regExpPhone = /^((\+7|7|8)+([0-9]){10})$/g
        if(regExpPhone.test(result)){
            return result
        } else {
            return '+7' + result
        }
    }

    render(){
        const { currentCity } = this.props
        if(currentCity && currentCity.phone ){
            return (
                <div className={ l.root }>
                    <Button
                        href={ `tel:${this.phoneTextToLink(currentCity.phone)}` }
                        type='primary'
                        icon='phone'
                        size='large'
                        className={ l.button }
                    >{ currentCity.phone }</Button>
                </div>
            )
        } else {
            return null
        }
        
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