import React from 'react'

import TextContent from 'client/site/components/content/TextContent/TextContent.jsx'

import l from './Testimonials.less'

const Testimonials = props => (
    <div className={ l.root }>
        <TextContent nameUrl='testimonials' />
    </div>
)

export default Testimonials
