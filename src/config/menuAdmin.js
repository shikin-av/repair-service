export default [     //TODO from api
    {
        url: '/',
        text: 'Главная',
        icon: 'home'
    },
    {
        url: '/orders',
        text: 'Заявки',
        icon: 'message',
        submenu: [
            {
                url: '/orders',
                text: 'Сегодня',
            },
            {
                url: '/orders/all',
                text: 'Все заявки',
            },
            {
                url: '/orders/calendar',
                text: 'Календарь',
            },
        ]
    },
    {
        url: '/users',
        text: 'Работники',
        icon: 'team'
    },
    {
        url: '/categories',
        text: 'Категории техники',
        icon: 'laptop'
    },
    {
        url: '/cities',
        text: 'Офисы',
        icon: 'environment-o'
    },
    {
        url: '/gallery',
        text: 'Галерея изображений',
        icon: 'picture'
    },
    {
        url: '/texts',
        text: 'Контент сайта',
        icon: 'file-text'
    }
]