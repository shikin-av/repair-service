import React from 'react'
import { string, node } from 'prop-types'

const Spin = require('antd/lib/spin')
require('antd/lib/spin/style/css')
const Alert = require('antd/lib/alert')
require('antd/lib/alert/style/css')

import l from './LoadedContentView.less'

const LoadedContentView = props => (
	<div className={ l.root }>		
		{ 
			props.loadStatus == 'complete' && 
			props.children 
		}
		{ 
			props.loadStatus == 'load' &&  
			<Spin className={ l.spin }/>
		}
		{ 
			props.loadStatus == 'empty' && props.message &&
            <Alert
                type='info'
                message={ props.message }
            /> 
        }
	</div>
)

LoadedContentView.propTypes = {
	loadStatus: string.isRequired,
	children:   node.isRequired,
	message:	string
}

export default LoadedContentView