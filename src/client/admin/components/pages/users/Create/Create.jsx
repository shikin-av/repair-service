import React from 'react'

import UserEdit from 'client/admin/components/pages/users/Edit/Edit.jsx'

const Create = props => (
    <UserEdit type='create' history={ props.history } />
)

export default Create
