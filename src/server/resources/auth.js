import express from 'express'
import jwt from 'jsonwebtoken'

import User from '../models/User'

export default () => {
    const auth = {}

    auth.notAuthorized = (res) => {
        res.redirect('/#/login')
    }

    auth.verifyAdmin = express.Router()
    auth.verifyAdmin.all('*', function(req, res, next){
        if(auth.verifyCookieToken(req, res, 'администратор')){
            next()
        } else {
            auth.notAuthorized(res)
        }
    })

    auth.verifyUser = express.Router()
    auth.verifyUser.all('*', function(req, res, next){
        if(auth.verifyCookieToken(req, res, false)){
            next()
        } else {
            auth.notAuthorized(res)
        }
    })

    auth.verifyCookieToken = (req, res, needRole = false) => {
        const config = req.app.get('config')
        const token = req.cookies['auth_token']
        if(token){
            const user = auth.getUser(token, config.jwt.secret)
            if(user){
                auth.isDemoUser(req, res, user)
                if(needRole){
                    if(user.role == needRole){
                        return true
                    } else {
                        return false
                    }
                } else {
                    return true
                }
            }
        } else {
            return false
        }
    }

    auth.isDemoUser = (req, res, user) => {
        if(user.demo){
            if(!req.app.get('demoUser')){
                req.app.set('demoUser', true)
            }
            if(!req.cookies.demo){
                res.cookie('demo', true)
            }            
        }
    }

    auth.validateDB = async (login, password) => {
        const user = await User.findOne({
            login
        })
        if(user && await user.verifyPassword(password)){
            return {
                isAuthenticated: true,
                user: {
                    login:       user.login,
                    role:        user.role,
                    fio:         user.fio,
                    city:        user.city,
                    cityNameUrl: user.cityNameUrl,
                    demo:        user.demo || false
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
        const token = jwt.sign(user, secret)
        return token
    }

    auth.getUser = (token, secret) => {
        const user = jwt.verify(token, secret)
        return user
    }

    return auth
}
