import React from 'react'

const Alert = require('antd/lib/alert')
require('antd/lib/alert/style/css')

const DemoMessage = () => (
    <Alert         
        type='info'
        message='В демо-режиме данные не будут сохраняться, кроме работы с заявками'
        style={{ marginLeft: 16 }}
    />
)

export default DemoMessage