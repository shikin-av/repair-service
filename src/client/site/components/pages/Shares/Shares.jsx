import React from 'react'

import TextContent from 'client/site/components/content/TextContent/TextContent.jsx'

import l from './Shares.less'

const Shares = props => (
    <div className={ l.root }>
        <TextContent nameUrl='shares' />
    </div>
)

export default Shares
