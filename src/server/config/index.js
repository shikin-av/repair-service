import db from './db'

export default {
    port: 80,
    db,
    bundle: {
        index: './dist/index.bundle.js',
        admin: './dist/admin.bundle.js',
    },
    indexTitle: 'Ремонт бытовой техники',
    jwt: {
        secret: 'MY_SECRET'
    }
}
