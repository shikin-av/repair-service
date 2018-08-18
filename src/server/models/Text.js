import mongoose from 'mongoose'
import uniqueValidator from 'mongoose-unique-validator'

import clearSpecialSymbols from '../resources/clearSpecialSymbols'

const TextSchema = new mongoose.Schema({
	title: {
		type: String,
		required: true,
	},
	content: {
		type: Object,
		required: true,
	},
	nameUrl: {
		type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
	}
})

TextSchema.plugin(uniqueValidator)

TextSchema.pre('save', function(next){
    const text = this
    text.nameUrl = clearSpecialSymbols(text.nameUrl)
    next()
})

export default mongoose.model('Text', TextSchema)