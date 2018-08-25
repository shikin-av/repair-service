import React from 'react'
import { object, bool, array } from 'prop-types'
import { Link } from 'react-router-dom'

const Button = require('antd/lib/button')
require('antd/lib/button/style/css')
const Icon = require('antd/lib/icon')
require('antd/lib/icon/style/css')

import l from './BreadcrumbsPanel.less'

const BreadcrumbsPanel = props => (
    <div className={ l.root }>
        { props.backButton &&
            <Button
                type=''
                onClick={ () => props.history.goBack() }
            >Назад</Button>
        }
        <Link to='/' className={ l.home }>
            <Icon type="home" />
        </Link>
        { props.links.map(link => (
                    <span key={ link.url }>
                        { ' / ' }
                        <Link to={ link.url } >{ link.text }</Link>
                    </span>
                )
            )
        }
    </div>
)

BreadcrumbsPanel.propTypes = {
    history:    object.isRequired,
    backButton: bool,
    links:      array.isRequired
}

export default BreadcrumbsPanel
