const Post = require('../models/Post');
const Like = require('../models/Like');
const Activity = require('../models/Activity');
const Block = require('../models/Block');

// @desc    Create a new post
// @route   POST /api/posts
// @access  Private
const createPost = async (req, res) => {
    try {
        const { content } = req.body;

        const post = await Post.create({
            user: req.user.id,
            content
        });

        // Create activity
        await Activity.create({
            user: req.user.id,
            type: 'post_created',
            targetPost: post._id,
            metadata: {
                postId: post._id,
                content: content.substring(0, 100) // Store truncated content
            }
        });

        res.status(201).json(post);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Get all posts (with filtering for blocked users)
// @route   GET /api/posts
// @access  Private
const getPosts = async (req, res) => {
    try {
        // Get list of blocked users
        const blockedUsers = await Block.find({ blocker: req.user.id })
            .select('blocked');
        const blockedUserIds = blockedUsers.map(b => b.blocked);

        const posts = await Post.find({
            isDeleted: false,
            user: { $nin: blockedUserIds }
        })
        .populate('user', 'username')
        .sort({ createdAt: -1 })
        .limit(50);

        // Add like count and user's like status
        const postsWithLikes = await Promise.all(posts.map(async (post) => {
            const likeCount = await Like.countDocuments({ 
                post: post._id, 
                isDeleted: false 
            });
            const userLiked = await Like.exists({ 
                post: post._id, 
                user: req.user.id,
                isDeleted: false 
            });
            
            return {
                ...post.toObject(),
                likeCount,
                userLiked: !!userLiked
            };
        }));

        res.json(postsWithLikes);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Like a post
// @route   POST /api/posts/:id/like
// @access  Private
const likePost = async (req, res) => {
    try {
        const postId = req.params.id;
        
        // Check if post exists and not deleted
        const post = await Post.findOne({ 
            _id: postId, 
            isDeleted: false 
        });

        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        // Check if already liked
        const existingLike = await Like.findOne({
            post: postId,
            user: req.user.id
        });

        if (existingLike) {
            if (existingLike.isDeleted) {
                existingLike.isDeleted = false;
                existingLike.deletedBy = undefined;
                await existingLike.save();
            } else {
                return res.status(400).json({ message: 'Already liked' });
            }
        } else {
            await Like.create({
                post: postId,
                user: req.user.id
            });
        }

        // Create activity
        await Activity.create({
            user: req.user.id,
            type: 'post_liked',
            targetPost: postId,
            targetUser: post.user,
            metadata: {
                postId: postId,
                likedBy: req.user.username
            }
        });

        res.json({ message: 'Post liked successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Unlike a post
// @route   DELETE /api/posts/:id/like
// @access  Private
const unlikePost = async (req, res) => {
    try {
        const postId = req.params.id;

        const like = await Like.findOne({
            post: postId,
            user: req.user.id,
            isDeleted: false
        });

        if (!like) {
            return res.status(404).json({ message: 'Like not found' });
        }

        like.isDeleted = true;
        like.deletedBy = req.user.id;
        await like.save();

        res.json({ message: 'Post unliked successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Delete a post (soft delete)
// @route   DELETE /api/posts/:id
// @access  Private
const deletePost = async (req, res) => {
    try {
        const postId = req.params.id;
        const userId = req.user.id;
        const userRole = req.user.role;

        const post = await Post.findById(postId);

        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        // Check permissions
        const isOwner = post.user.toString() === userId.toString();
        const isAdmin = userRole === 'admin' || userRole === 'owner';

        if (!isOwner && !isAdmin) {
            return res.status(403).json({ 
                message: 'Not authorized to delete this post' 
            });
        }

        post.isDeleted = true;
        post.deletedBy = userId;
        post.deletedAt = new Date();
        await post.save();

        res.json({ message: 'Post deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = {
    createPost,
    getPosts,
    likePost,
    unlikePost,
    deletePost
};