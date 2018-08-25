import React from 'react'

import Gallery from 'client/admin/components/content/Gallery/Gallery.jsx'
import BreadcrumbsPanel from 'client/admin/components/content/BreadcrumbsPanel/BreadcrumbsPanel.jsx'

import l from  'client/admin/components/style/GetAll.less'

const GalleryPage = props => (
    <div className={ l.root }>
        <BreadcrumbsPanel
            history={ props.history }
            backButton={ true }
            links={[
                { url: '/gallery', text:'Галерея изображений' }
            ]}
        />
        <h1>Галерея изображений</h1>
        <Gallery/>
    </div>
)

export default GalleryPage
