import React from 'react'

import TextEdit from 'client/admin/components/pages/texts/Edit/Edit.jsx'

const Create = props => (
    <TextEdit type='create' history={ props.history } />
)

export default Create