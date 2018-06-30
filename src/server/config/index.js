import db from './db'

export default {
    port: 80,
    db,
    bundle: {
        index: './dist/index.bundle.js',
        admin: './dist/admin.bundle.js',
        login: '/dist/login.bundle.js',
    },
    indexTitle: 'Ремонт бытовой техники',
    jwt: {
        secret: 'MY_SECRET',
        expiresSec: 60 * 60 * 12,
    }
}
