import common from './common'

export default {
    protocol: common.protocol,
    host:     common.host,
    port:     common.port,
    assets: {
        logo: {
            gorizontal: 'logo-gorizontal.png',
            vertical:   'logo-vertical.png'
        }            
    },
    assetsPath:         common.assetsPath,
    userRoles:          common.userRoles,
    defaultWorkingDays: common.defaultWorkingDays
}