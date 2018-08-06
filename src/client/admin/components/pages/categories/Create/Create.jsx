import React from 'react'

import CategoryEdit from 'client/admin/components/pages/categories/Edit/Edit.jsx'

const Create = props => (
    <CategoryEdit type='create' history={ props.history } />
)

export default Create
