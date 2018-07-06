import db from './db'

export default {
    port: 80,
    db,
    bundle: {
        js: {
            site: './dist/site.bundle.js',
            admin: './dist/admin.bundle.js',
            login: '/dist/login.bundle.js',
        },
        css: {
            site: './dist/site.bundle.css',
            admin: './dist/admin.bundle.css',
            login: './dist/login.bundle.css',
        }
    },
    indexTitle: 'Ремонт бытовой техники',
    jwt: {
        secret: 'MY_SECRET',
        expiresSec: 60 * 60 * 12,
    }
}
