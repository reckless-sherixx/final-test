const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
  title: {
    type: String,
    // required: true,
    required: false,
  },
  description: String,
  content: {
    type: Object,
    required: true,
  },
  coverImg: String,
  category: String,
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  rating: Number,
  createdAt: {
    type: Date,
    default: Date.now,
  }
})

PostSchema.set("toJSON", {
  transform: (doc, ret) => {
    ret.id = ret._id
    delete ret._id
    delete ret.__v
  }
})

const Post = mongoose.model('Post', PostSchema);
module.exports = Post;