import React from 'react'
import {Link} from 'react-router-dom'

import config from 'client/../config/client'
import l from './Logo.less'

const Logo = (props) => (
    <div className={ l.root }>
        <Link to='/'>
            <img src={`${ config.assetsPath }/imgs/design/${ config.assets.logo.gorizontal }`}/>
        </Link>
    </div>
)

export default Logo