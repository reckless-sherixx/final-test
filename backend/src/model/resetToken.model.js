import mongoose from 'mongoose';

const resetTokenSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  token: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now,
    required: true
  },
  customExpiry: {
    type: String,
    default: '24h'
  }
});

// Add an index that expires documents automatically based on createdAt
// Default 24 hours (86400 seconds)
resetTokenSchema.index({ createdAt: 1 }, { expireAfterSeconds: 86400 });

const ResetToken = mongoose.model('ResetToken', resetTokenSchema);

export default ResetToken;