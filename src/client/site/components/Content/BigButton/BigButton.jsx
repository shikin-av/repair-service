import React from 'react'
import { string, node } from 'prop-types'

const Button = require('antd/lib/button')
require('antd/lib/button/style/css')

import l from './BigButton.less'

const BigButton = props => (
    <Button 
        href={ props.href }
        type='primary' 
        htmltype={ props.htmlType ? props.htmlType : 'button' }
        disabled={ props.disabled ? props.disabled : false }
        className={ l.root }
        icon={ props.icon ? props.icon : null }
        id={ props.id }
    >
        { props.children }
    </Button>
)

BigButton.propTypes = {
    children:   node.isRequired,
    icon:       string
}

export default BigButton