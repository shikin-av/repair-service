import React from 'react'

const Button = require('antd/lib/button')
require('antd/lib/button/style/css')
const Icon = require('antd/lib/icon')
require('antd/lib/icon/style/css')

import l from './Page404.less'

const Page404 = props => (
    <div className={ l.root }>
        <h1>404</h1>
        <strong>Данной страницы не существует</strong>
        <br/>        
        <Button
            onClick={ () => props.history.goBack() }
            className={ l.button }
        >Назад</Button>
        <br/>        
        <Button 
            href='/#/' 
            className={ l.button }    
        >Главная страница</Button>        
    </div>
    
)

export default Page404