import mongoose from 'mongoose'
import _ from 'lodash'
import uniqueValidator from 'mongoose-unique-validator'
import Promise from 'bluebird'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
const bcryptGenSalt = Promise.promisify(bcrypt.genSalt)
const bcryptHash = Promise.promisify(bcrypt.hash)
const bcryptCompare = Promise.promisify(bcrypt.compare)


const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
    },
    password: {
        type: String,
        required: true,
    },
    fio: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        required: true,
        enum: ['admin', 'worker'],
    }
})

const SALT_WORK_FACTOR = 10



UserSchema.pre('save', function(next){
    if(!this.isModified('password')){
        return next()
    }else{
        return bcryptGenSalt(SALT_WORK_FACTOR)
        .then(salt => {
            bcryptHash(this.password, salt)
            .then(hash => {
                this.password = hash
                next()
            })
        })
        .catch(next)
    }
})

UserSchema.methods.toJSON = function(){
    // get without "password", "role"
    return _.omit(this.toObject(), ['password', 'role'])
}

export default mongoose.model('User', UserSchema)
