import common from './common'

export default {
    port:     common.port,
    assets: {
        logo: {
            gorizontal: 'logo-gorizontal.png',
            vertical:   'logo-vertical.png',
            mini:       'logo-mini.png',
        }            
    },
    assetsPath:         common.assetsPath,
    userRoles:          common.userRoles,
    defaultWorkingDays: common.defaultWorkingDays,
    apiPath: '/admin/api',
    date: {
        dateLinkFormat: 'YYYY-MM-DD',
        dateViewOptions: {
            month: 'long',
            day: 'numeric'
        }
    },
    workTime: {
        begin: 9,
        end: 18
    },    
}