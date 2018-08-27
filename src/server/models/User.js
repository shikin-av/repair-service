import mongoose from 'mongoose'
import _ from 'lodash'
import uniqueValidator from 'mongoose-unique-validator'
import Promise from 'bluebird'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
const bcryptGenSalt = Promise.promisify(bcrypt.genSalt)
const bcryptHash = Promise.promisify(bcrypt.hash)
const bcryptCompare = Promise.promisify(bcrypt.compare)

import config from '../../config/server'

const UserSchema = new mongoose.Schema({
    login: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
    },
    password: {
        type: String,
        required: false,
    },
    role: {
        type: String,
        required: true,
        enum: config.userRoles,
    },
    fio: {
        type: String,
        required: true,
    },
    city: {
        type: String,
        required: true
    },
    cityNameUrl: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    workingDays: {
        type: Array,
        required: false,
        default: config.defaultWorkingDays
    },
    categories: {
        type: Array,
        required: false
    },
    demo: {
        type: Boolean,
        required: false,
        default: false        
    }
})

const SALT_WORK_FACTOR = 10

UserSchema.pre('save', function(next){
    const user = this
    if(!user.isModified('password')) return next()
    bcryptGenSalt(SALT_WORK_FACTOR)
    .then(salt => {
        bcryptHash(user.password, salt)
        .then(hash => {
            user.password = hash
            return next()
        })
    })
    .catch(next)
})

UserSchema.methods.verifyPassword = async function(password){
    return await bcryptCompare(password, this.password)
}

UserSchema.methods.toJSON = function(){
    // get without 'password'
    return _.omit(this.toObject(), ['password'])
}

export default mongoose.model('User', UserSchema)
