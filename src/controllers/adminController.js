const User = require('../models/User');
const Post = require('../models/Post');
const Like = require('../models/Like');
const Activity = require('../models/Activity');

// @desc    Get all users (for admin)
// @route   GET /api/admin/users
// @access  Private/Admin
const getAllUsers = async (req, res) => {
    try {
        const users = await User.find({})
            .select('-password')
            .sort({ createdAt: -1 });

        res.json(users);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Delete a user (soft delete)
// @route   DELETE /api/admin/users/:id
// @access  Private/Owner
const deleteUser = async (req, res) => {
    try {
        const targetUserId = req.params.id;
        const deleterId = req.user.id;

        // Cannot delete yourself
        if (targetUserId === deleterId.toString()) {
            return res.status(400).json({ 
                message: 'Cannot delete your own account via admin endpoint' 
            });
        }

        const user = await User.findById(targetUserId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Check if trying to delete owner (only owner can delete owner)
        if (user.role === 'owner' && req.user.role !== 'owner') {
            return res.status(403).json({ 
                message: 'Only owner can delete another owner' 
            });
        }

        // Soft delete user
        user.isActive = false;
        await user.save();

        // Record activity
        await Activity.create({
            user: deleterId,
            type: 'user_deleted',
            targetUser: targetUserId,
            metadata: {
                deletedBy: req.user.username,
                deletedUser: user.username
            }
        });

        res.json({ 
            message: 'User deleted successfully',
            deletedBy: req.user.role 
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Make a user admin
// @route   POST /api/admin/users/:id/make-admin
// @access  Private/Owner
const makeAdmin = async (req, res) => {
    try {
        const targetUserId = req.params.id;

        const user = await User.findById(targetUserId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (user.role === 'admin') {
            return res.status(400).json({ message: 'User is already admin' });
        }

        user.role = 'admin';
        await user.save();

        res.json({ message: 'User promoted to admin successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Remove admin privileges
// @route   POST /api/admin/users/:id/remove-admin
// @access  Private/Owner
const removeAdmin = async (req, res) => {
    try {
        const targetUserId = req.params.id;

        // Cannot remove own admin privileges
        if (targetUserId === req.user.id.toString()) {
            return res.status(400).json({ 
                message: 'Cannot remove your own admin privileges' 
            });
        }

        const user = await User.findById(targetUserId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (user.role !== 'admin') {
            return res.status(400).json({ message: 'User is not an admin' });
        }

        user.role = 'user';
        await user.save();

        res.json({ message: 'Admin privileges removed successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Delete a post (admin override)
// @route   DELETE /api/admin/posts/:id
// @access  Private/Admin
const adminDeletePost = async (req, res) => {
    try {
        const postId = req.params.id;

        const post = await Post.findById(postId);

        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        post.isDeleted = true;
        post.deletedBy = req.user.id;
        post.deletedAt = new Date();
        await post.save();

        // Record activity
        await Activity.create({
            user: req.user.id,
            type: 'post_deleted',
            targetPost: postId,
            targetUser: post.user,
            metadata: {
                deletedBy: req.user.username,
                postOwner: (await User.findById(post.user)).username
            }
        });

        res.json({ 
            message: 'Post deleted by admin',
            deletedBy: req.user.role 
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Delete a like (admin override)
// @route   DELETE /api/admin/likes/:id
// @access  Private/Admin
const adminDeleteLike = async (req, res) => {
    try {
        const likeId = req.params.id;

        const like = await Like.findById(likeId);

        if (!like) {
            return res.status(404).json({ message: 'Like not found' });
        }

        like.isDeleted = true;
        like.deletedBy = req.user.id;
        await like.save();

        res.json({ 
            message: 'Like deleted by admin',
            deletedBy: req.user.role 
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Get system statistics
// @route   GET /api/admin/stats
// @access  Private/Admin
const getStats = async (req, res) => {
    try {
        const [
            totalUsers,
            activeUsers,
            totalPosts,
            activePosts,
            totalLikes,
            totalActivities
        ] = await Promise.all([
            User.countDocuments(),
            User.countDocuments({ isActive: true }),
            Post.countDocuments(),
            Post.countDocuments({ isDeleted: false }),
            Like.countDocuments({ isDeleted: false }),
            Activity.countDocuments({ isVisible: true })
        ]);

        res.json({
            totalUsers,
            activeUsers,
            totalPosts,
            activePosts,
            totalLikes,
            totalActivities
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = {
    getAllUsers,
    deleteUser,
    makeAdmin,
    removeAdmin,
    adminDeletePost,
    adminDeleteLike,
    getStats
};