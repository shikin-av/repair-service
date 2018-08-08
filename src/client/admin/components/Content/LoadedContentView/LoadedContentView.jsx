import React from 'react'

const Spin = require('antd/lib/spin')
require('antd/lib/spin/style/css')
const Alert = require('antd/lib/alert')
require('antd/lib/alert/style/css')

import l from './LoadedContentView.less'

const LoadedContentView = props => (
	<div>
		{ 
			props.loadStatus == 'complete' && 
			props.children 
		}
		{ 
			props.loadStatus == 'load' &&  
			<Spin/> 
		}
		{ 
			props.loadStatus == 'empty' &&
            <Alert
                type='info'
                message={ props.message }
            /> 
        }
	</div>
)

export default LoadedContentView