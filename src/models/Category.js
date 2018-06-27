import mongoose from 'mongoose'
import _ from 'lodash'
import uniqueValidator from 'mongoose-unique-validator'


const  CategorySchema = new mongoose.Schema({
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
    const regExp = /[^\w-]/g
    category.nameUrl = category.nameUrl.replace(regExp, '')
    next()
})

CategorySchema.methods.toJSON = function(){
    return _.pick(this, ['name', 'nameUrl', 'image', 'problems'])
}

export default mongoose.model('Category', CategorySchema)
