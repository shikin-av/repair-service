import React from 'react'
import { func } from 'prop-types'

const DatePicker = require('antd/lib/date-picker')
require('antd/lib/date-picker/style/css')
const LocaleProvider = require('antd/lib/locale-provider')
require('antd/lib/locale-provider/style/css')
const ru = require('antd/lib/locale-provider/ru_RU')
import moment from 'moment'
const Button = require('antd/lib/button')
require('antd/lib/button/style/css')

import l from './DateInput.less'

const dateFormat = 'DD-MM-YYYY'

class DateInput extends React.Component {
    constructor(props){
        super(props)
        this.today = moment().add(0, 'day')
        this.tomorrow = moment().add(1, 'day')

        this.state = {
            currentDate: null,
            activeEl: null
        }
    }

    componentWillMount(){
        this.onDateChange(this.today)
    }    

    onDateChange(date) {
        this.setState({ currentDate: date }, () => {            
            const dateString = date.format(dateFormat)
            switch(dateString){
                case this.today.format(dateFormat):
                    this.setState({ activeEl: 'today' })
                    break
                case this.tomorrow.format(dateFormat):
                    this.setState({ activeEl: 'tomorrow' })
                    break
                default: this.setState({ activeEl: 'other' })
            }
            this.props.onDataToForm(date) // (dateString)
        })
    }

    disabledDate(current) {
        return current && current < moment().subtract(1, 'day')
    }

    render(){
        const { currentDate, activeEl } = this.state
        return (
            <div className={ l.root }>
                <Button 
                    onClick={ e => this.onDateChange(this.today) }
                    className={ (activeEl == 'today') ? l.activeButton : null }
                >Сегодня</Button>
                
                <Button
                    onClick={ e => this.onDateChange(this.tomorrow) }
                    className={ (activeEl == 'tomorrow') ? l.activeButton : null }
                >Завтра</Button>

                <LocaleProvider locale={ ru }>
                    <DatePicker
                        value={ currentDate }
                        format={ dateFormat }
                        disabledDate={ date => this.disabledDate(date) }
                        onChange={ date => this.onDateChange(date) }
                        className={ (activeEl == 'other') ? l.activaDatePicker : null }
                        showToday={false}
                        allowClear={false}
                    />
                </LocaleProvider>
            </div>
        )
    }
}

DateInput.propTypes = {
    onDataToForm: func.isRequired,
}

export default DateInput