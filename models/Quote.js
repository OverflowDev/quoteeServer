const mongoose = require('mongoose')

const QuoteSchema = new mongoose.Schema({
    body: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    createdAt: {
        type: String,
        required: true
    },
    comments: [
        {
            body: {
                type: String
            }, 
            username: {
                type: String
            },
            createdAt: {
                type: String
            },
        }
    ],
    likes: [
        { 
            username: {
                type: String
            },
            createdAt: {
                type: String
            },
        }
    ],
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: true
    }
})

const Quote = mongoose.model('Quote', QuoteSchema)

module.exports = Quote