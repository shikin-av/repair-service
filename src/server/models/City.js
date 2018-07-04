import mongoose from 'mongoose'
import _ from 'lodash'
import uniqueValidator from 'mongoose-unique-validator'

const CitySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    nameUrl: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
    },
    phone: {
        type: String,
        required: true,
    },
    officeAddress: {
        type: String,
        required: true,
    }
})

CitySchema.plugin(uniqueValidator)

CitySchema.pre('save', function(next){
    const city = this
    const regExp = /[^\w-]/g
    city.nameUrl = city.nameUrl.replace(regExp, '')
    next()
})

CitySchema.methods.toJSON = function(){
    return _.pick(this, ['name', 'nameUrl', 'phone', 'officeAddress'])
}

export default mongoose.model('City', CitySchema)