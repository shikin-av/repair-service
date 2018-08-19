import React from 'react'

import l from './TextEditor.less'

export const renderNode = props => {
    const { attributes, children, node, isFocused } = props
    switch(node.type){
        case 'block-quote':
            return <blockquote { ...attributes }>{ children }</blockquote>
        case 'bulleted-list':
            return <ul { ...attributes }>{ children }</ul>
        case 'heading-one':
            return <h1 { ...attributes }>{ children }</h1>
        case 'heading-two':
            return <h2 { ...attributes }>{ children }</h2>
        case 'list-item':
            return <li { ...attributes }>{ children }</li>
        case 'numbered-list':
            return <ol { ...attributes }>{ children }</ol>
        case 'image':
            const src = node.data.get('src')
            return <img 
                src={ src } 
                className={ isFocused ? l.selectedImg : '' }
                selected={ isFocused } 
                {...attributes} 
            />
    }
}

export const renderMark = props => {
    const { children, mark, attributes } = props
    switch(mark.type){
        case 'bold':
            return <strong { ...attributes }>{ children }</strong>            
        case 'italic':
            return <em { ...attributes }>{ children }</em>
        case 'underlined':
            return <u { ...attributes }>{ children }</u>
    }
}