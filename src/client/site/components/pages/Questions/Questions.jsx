import React from 'react'

import TextContent from 'client/site/components/content/TextContent/TextContent.jsx'

import l from './Questions.less'

const Questions = props => (
    <div className={ l.root }>
        <TextContent nameUrl='questions' />
    </div>
)

export default Questions
