import mongoose from 'mongoose'
import _ from 'lodash'

const  OrderSchema = new mongoose.Schema({
    //_id: mongoose.Schema.Types.ObjectId,
    id: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    time: {
        type: String,
        required: false
    },
    firm: {
        type: String,
        required: false
    },
    howOld: {
        type: String,
        required: false
    },
    problems: {
        type: Array,
        required: false
    },
    description: {
        type: String,
        required: false
    },
    address: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    city: {
        type: String,
        required: true
    },
    /*category: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Category',
        required: true
    },*/
    categoryShortName: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    worker: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User',
        required: false
    },
    status: {
        type: String,        
        enum: ['new', 'working', 'complete'],
        default: 'new',
        required: true,
    }
}, {
    timestamps: true
})

export default mongoose.model('Order', OrderSchema)