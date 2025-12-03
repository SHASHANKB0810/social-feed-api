const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    content: {
        type: String,
        required: true,
        maxlength: 1000
    },
    isDeleted: {
        type: Boolean,
        default: false
    },
    deletedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    deletedAt: Date,
    createdAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

// Index for efficient querying
postSchema.index({ user: 1, createdAt: -1 });
postSchema.index({ isDeleted: 1, createdAt: -1 });

module.exports = mongoose.model('Post', postSchema);