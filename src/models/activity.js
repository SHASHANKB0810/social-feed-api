const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    type: {
        type: String,
        enum: ['post_created', 'post_liked', 'user_followed'],
        required: true
    },
    targetUser: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    targetPost: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post'
    },
    metadata: {
        type: mongoose.Schema.Types.Mixed
    },
    isVisible: {
        type: Boolean,
        default: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

// Index for feed queries
activitySchema.index({ isVisible: 1, createdAt: -1 });
activitySchema.index({ user: 1, createdAt: -1 });

module.exports = mongoose.model('Activity', activitySchema);