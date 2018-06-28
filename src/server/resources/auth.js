//import jwt from 'express-jwt'

import User from '../models/User'
import configFile from '../config'

export default (ctx) => {
    //context shoudl be instance of App (for get they config)
    let config = null
    ctx ? config = ctx.config : config = configFile
    const auth = {}

    return auth
}
