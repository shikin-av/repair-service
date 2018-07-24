import db from './db'
import common from './common'

export default {
    port: common.port,
    db,
    bundle: {
        js: {
            site: './dist/site.bundle.js',
            admin: './dist/admin.bundle.js',
        },
        css: {
            site: './dist/site.bundle.css',
            admin: './dist/admin.bundle.css',
        }
    },
    indexTitle: 'Ремонт бытовой техники',
    jwt: {
        secret: 'MY_SECRET',
        expiresSec: 60 * 60 * 12,
    },
    assetsPath: common.assetsPath,
    assetsDir: common.assetsDir
}
