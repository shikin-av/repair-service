import React from 'react'
import { array, string, func } from 'prop-types'

import l from './Radio.less'

class Radio extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            checked: null
        }
    }

    componentWillMount(){
        this.formatItems = this.props.items.map((item, index) => {
            let value = null
            let text = null
            if(typeof item == 'string'){
                value = item
                text = item
            } else if(typeof item == 'object'){
                if(item.value && item.text){
                    value = item.value
                    text = item.text
                } else if(item.value){
                    value = item.value
                    text = item.value
                } else if(item.text){
                    value = item.text
                    text = item.text
                }
            }
            return { value, text }
        })        
    }

    componentDidMount(){
        const { defaultChecked } = this.props
        if(this.formatItems){
            const firstValue = this.formatItems[0].value
            this.setState({ 
                checked: defaultChecked || firstValue 
            }, () => {
                this.props.onData(this.state.checked)
            })
        }
        
    }

    onChange(e){
        //console.log(e.target.value)
        this.setState({ checked: e.target.value }, () => {
            this.props.onData(this.state.checked)
        })
    }

    render(){
        const { name, style } = this.props
        return (
            <div className={ l.root }>
                {   
                    this.formatItems.map((item, index) => {
                        const isChecked = this.state.checked == item.value
                        return (
                            <label key={ Math.random() } >
                                <input 
                                    type='radio'
                                    value={ item.value }
                                    name={ name }
                                    onChange={ e => this.onChange(e) }
                                    checked={ isChecked }
                                />
                                <span className={ isChecked ? l.checked : null }>
                                    { item.text }
                                </span>
                                { !(style == 'inline') && <br/> }
                            </label>
                        )
                    })
                }
            </div>
        )
    }
}

Radio.propTypes = {
    name:           string.isRequired,
    items:          array.isRequired,
    onData:         func.isRequired,
    style:          string,
    defaultChecked: string
}

export default Radio