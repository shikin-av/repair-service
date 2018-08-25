import mongoose from 'mongoose'
import _ from 'lodash'
import uniqueValidator from 'mongoose-unique-validator'

import clearSpecialSymbols from '../resources/clearSpecialSymbols'

const  CategorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    singularName: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
    },
    nameUrl: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
    },
    shortName: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        required: true,
    },
    problems: {
        type: Array,
        required: false,
    }
}, {
    timestamps: true
})

CategorySchema.plugin(uniqueValidator)

CategorySchema.pre('save', function(next){
    const category = this
    category.nameUrl = clearSpecialSymbols(category.nameUrl)
    next()
})

CategorySchema.methods.toJSON = function(){
    return _.pick(this, ['name', 'singularName', 'nameUrl', 'shortName', 'image', 'problems'])
}

export default mongoose.model('Category', CategorySchema)
