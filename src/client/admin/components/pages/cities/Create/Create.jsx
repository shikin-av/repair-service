import React from 'react'

import CityEdit from 'client/admin/components/pages/cities/Edit/Edit.jsx'

const Create = props => (
    <CityEdit type='create' history={ props.history } />
)

export default Create
