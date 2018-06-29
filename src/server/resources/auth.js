import express from 'express'
import jwt from 'jsonwebtoken'

import User from '../models/User'

//TODO Fake Users
const users_db = [
    {
        login: 'admin',
        password: '123',
        fio: 'I Admin',
        role: 'admin'
    },
    {
        login: 'worker',
        password: '123',
        fio: 'I worker',
        role: 'worker'
    }
]

export default () => {
    const auth = {}
    auth.verifyCookieToken = express.Router()
    auth.verifyCookieToken.all('*', function(req, res, next){
        const token = req.cookies['auth_token']
        const config = req.app.get('config')
        if(token){
            const user = auth.getUser(token, config.jwt.secret)
            if(user){
                next()
            }else{
                res.redirect('/login')
            }
        } else {
            res.redirect('/login')

        }
    })

    auth.validate = (login, password) => {
        const user = users_db.find(function(item){
            if(item.login == login && item.password == password){
                return true
            } else {
                return false
            }
        })
        if(user){
            return {
                isAuthenticated: true,
                user: {
                    login: user.login,
                    role: user.role
                }
            }
        } else {
            return {
                isAuthenticated: false,
                user: null
            }
        }
    }

    auth.getToken = (user, secret, expiresSec) => {
        const token = jwt.sign(user, secret, { expiresIn: expiresSec })
        return token
    }

    auth.getUser = (token, secret) => {
        const user = jwt.verify(token, secret)
        return user
    }

    return auth
}
