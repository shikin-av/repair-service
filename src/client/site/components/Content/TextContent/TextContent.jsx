import React from 'react'
import { string } from 'prop-types'
import { Editor } from 'slate-react'
import { Value } from 'slate'
import Plain from 'slate-plain-serializer'

import LoadedContentView from 'client/admin/components/content/LoadedContentView/LoadedContentView.jsx'
import { renderNode, renderMark } from 'client/admin/components/content/TextEditor/renderElements'

import {
	getText as getTextApi
} from 'client/site/api'

class TextContent extends React.Component {
	constructor(props){
		super(props)
		this.state = {
			content: Plain.deserialize(''),
			loadStatus: 'load'
		}
	}

	componentWillMount(){
		const { nameUrl } = this.props
		try {
			getTextApi(nameUrl)
			.then(text => {
				if(!text.error){
					const content = Value.fromJSON(text.content)
					this.setState({ 
						content,
						loadStatus: 'complete'
					})
				} else {
					this.setState({ loadStatus: 'empty' })
				}
			})
		} catch(err) {
			this.setState({ loadStatus: 'empty' })
		}
	}

	onChange(){ return }

	render(){
		return (
			<LoadedContentView
                loadStatus={ this.state.loadStatus }
            >
				<Editor 
					readOnly
					value={ this.state.content }
					onChange={ obj => this.onChange }
					renderNode={ props => renderNode(props) }
	                renderMark={ props => renderMark(props) }
				/>
			</LoadedContentView>
		)
	}
	
}

TextContent.propTypes = {
	nameUrl: string.isRequired
}

export default TextContent