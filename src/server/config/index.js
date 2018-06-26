import db from './dbConfig'

export default {
    port: 80,
    db,
    bundle: {
        index: './dist/index.bundle.js',
        admin: './dist/admin.bundle.js',
    }
}
