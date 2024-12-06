const mongoose  = require('mongoose');

const AnnouncementSchema  = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        },
    content: {
        type: Object,
        required: true,
    },
    coverImg: String,
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

const Announcement =  mongoose.model('Announcement', AnnouncementSchema);
module.exports = Announcement;