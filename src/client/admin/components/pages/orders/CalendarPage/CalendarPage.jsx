import React from 'react'

const Row = require('antd/lib/row')
require('antd/lib/row/style/css')
const Badge = require('antd/lib/badge')
require('antd/lib/badge/style/css')

import Calendar from 'client/admin/components/content/Calendar/Calendar.jsx'
import BreadcrumbsPanel from 'client/admin/components/content/BreadcrumbsPanel/BreadcrumbsPanel.jsx'

const CalendarPage = props => {
	const breadcrumbsLinks = [
		{ url: '/orders', text:'Заявки' },
		{ url: '/orders/calendar', text:'Календарь' },
	]
	const legendStatuses = [
		{ status: 'error',   text: 'Новая заявка' },
		{ status: 'warning', text: 'В работе' },
		{ status: 'success', text: 'Выполнена' },
	]

	return (
		<Row>
			<BreadcrumbsPanel
                history={ props.history }
                backButton={ true }
                links={ breadcrumbsLinks }
            />
			<h1>Календарь заявок</h1>
			<div>
			{
				legendStatuses.map(item => (
					<Badge
	                    status={ item.status }
	                    text={ item.text }
	                    style={{ marginRight: 25 }}
	                    key={ item.status }
	                />
				))
			}
			</div>
			<Calendar/>
		</Row>
	)	
}

export default CalendarPage