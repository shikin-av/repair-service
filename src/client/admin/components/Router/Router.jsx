import React from 'react'
import { Switch, Route } from 'react-router-dom'

import Categories from 'client/admin/components/pages/categories/GetAll/GetAll.jsx'
import CategoryEdit from 'client/admin/components/pages/categories/Edit/Edit.jsx'
import CategoryCreate from 'client/admin/components/pages/categories/Create/Create.jsx'

import Cities from 'client/admin/components/pages/cities/GetAll/GetAll.jsx'
import CityEdit from 'client/admin/components/pages/cities/Edit/Edit.jsx'
import CityCreate from 'client/admin/components/pages/cities/Create/Create.jsx'

import Users from 'client/admin/components/pages/users/GetAll/GetAll.jsx'
import UserEdit from 'client/admin/components/pages/users/Edit/Edit.jsx'
import UserCreate from 'client/admin/components/pages/users/Create/Create.jsx'

import OrderEdit from 'client/admin/components/pages/orders/Edit/Edit.jsx'
import OrdersByCity from 'client/admin/components/pages/orders/GetAll/ByCity.jsx'
import OrdersByCityDate from 'client/admin/components/pages/orders/GetAll/ByCityDate.jsx'
import OrdersByCityDateStatus from 'client/admin/components/pages/orders/GetAll/ByCityDateStatus.jsx'
import OrdersByCityDateStatusWorker from 'client/admin/components/pages/orders/GetAll/ByCityDateStatusWorker.jsx'
import OrdersById from 'client/admin/components/pages/orders/GetAll/ById.jsx'

import Texts from 'client/admin/components/pages/texts/GetAll/GetAll.jsx'
import TextEdit from 'client/admin/components/pages/texts/Edit/Edit.jsx'
import TextCreate from 'client/admin/components/pages/texts/Create/Create.jsx'

import Gallery from 'client/admin/components/pages/GalleryPage/GalleryPage.jsx'
import Page404 from 'client/site/components/pages/Page404/Page404.jsx'
import Calendar from 'client/admin/components/pages/orders/CalendarPage/CalendarPage.jsx'

const Router = () => (
    <Switch>
        <Route
            exact path='/categories'
            component={ Categories }
        />
        <Route
            exact path='/categories/create'
            component={ CategoryCreate }
        />
        <Route
            exact path='/categories/:nameUrl'
            component={ CategoryEdit }
        />
        <Route
            exact path='/cities'
            component={ Cities }
        />
        <Route
            exact path='/cities/create'
            component={ CityCreate }
        />
        <Route
            exact path='/cities/:nameUrl'
            component={ CityEdit }
        />
        <Route
            exact path='/users'
            component={ Users }
        />
        <Route
            exact path='/users/create'
            component={ UserCreate }
        />
        <Route
            exact path='/users/:login'
            component={ UserEdit }
        />
        <Route
            exact path='/'
            component={ OrdersByCityDate }
        />
        <Route
            exact path='/orders'
            component={ OrdersByCityDate }
        />
        <Route
            exact path='/orders/all'
            component={ OrdersByCity }
        />
        <Route
            exact path='/orders/calendar'
            component={ Calendar }
        />
        <Route
            exact path='/orders/date/:dateString'
            component={ OrdersByCityDate }
        />
        <Route
            exact path='/orders/date/:dateString/status/:status'
            component={ OrdersByCityDateStatus }
        />
        <Route
            exact path='/orders/date/:dateString/status/:status/worker/:workerLogin'
            component={ OrdersByCityDateStatusWorker }
        />
        <Route
            exact path='/orders/serch-id/:id'
            component={ OrdersById }
        />
        <Route
            exact path='/orders/date/:dateString/id/:id'
            component={ OrderEdit }
        />
        <Route
            exact path='/gallery'
            component={ Gallery }
        />
        <Route
            exact path='/texts'
            component={ Texts }
        />
        <Route
            exact path='/texts/create'
            component={ TextCreate }
        />
        <Route
            exact path='/texts/:nameUrl'
            component={ TextEdit }
        />
        <Route component={ () => { 
            return ( <Page404 toHome='/admin#/' /> ) 
        }} />
    </Switch>
)

export default Router
