import React from 'react'
import { Link } from 'react-router-dom'

import l from './CategoryItem.less'

const CategoryItem = props => (
    <div className={ l.root }>
        <p>
            <Link to={ `/categories/${ props.category.nameUrl }` }>
                <img src={ `/assets/imgs/categories/${ props.category.image }` }/>
            </Link>
        </p>
        <p className={ l.name }>
            <Link to={ `/categories/${ props.category.nameUrl }` }>
                { props.category.name }
            </Link>
        </p>
    </div>
)

export default CategoryItem