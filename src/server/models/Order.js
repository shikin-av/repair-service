import mongoose from 'mongoose'

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
    dateToLink: {
        type: String,
        required: true
    },
    dateToView: {
        type: String,
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
    apartment: {
        type: String,
        required: false
    },
    phone: {
        type: String,
        required: true
    },
    city: {
        type: String,
        required: true
    },
    cityNameUrl: {
        type: String,
        required: true
    },
    categoryShortName: {
        type: String,
        required: true
    },
    categoryNameUrl: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    workerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: false
    },
    status: {
        type: String,
        enum: ['new', 'working', 'complete', 'trash'],
        default: 'new',
        required: true,
    },
    smsStatus: {
        type: String,
        enum: ['not sended', 'sended', 'error'],
        default: 'not sended',
        required: false,
    }
}, {
    timestamps: true
})

export default mongoose.model('Order', OrderSchema)
