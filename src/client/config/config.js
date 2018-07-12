export default {
    protocol: 'http',
    host: 'localhost',
    port: 80,
    assets: {
        logo: {
            gorizontal: 'logo-gorizontal.png',
            vertical:   'logo-vertical.png'
        }            
    },
    menu: [     // from api
        {
            url: '/',
            text: 'Главная'
        },
        {
            url: '/404',
            text: '404'
        }
    ]
}