const mongoose  = require('mongoose');

const CasPostSchema  = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        },
    description: String,
    content: {
        type: Object,
        required: true,
    },
    coverImg: String,
    category: String,
    author:  {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required:  true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    }
})

const CasPost =  mongoose.model('CAS', CasPostSchema);
module.exports = CasPost;