import React from 'react'

import Gallery from 'client/admin/components/content/Gallery/Gallery.jsx'
import BreadcrumbsPanel from 'client/admin/components/content/BreadcrumbsPanel/BreadcrumbsPanel.jsx'

import l from './GalleryPage.less'

const GalleryPage = props => (
    <div>
        <BreadcrumbsPanel
            history={ props.history }
            backButton={ true }
            links={[
                { url: '/gallery', text:'Галерея изображений' }
            ]}
        />
        <Gallery/>
    </div>
)

export default GalleryPage
