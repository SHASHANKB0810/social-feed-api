const User = require('../models/User');
const Follow = require('../models/Follow');
const Block = require('../models/Block');
const Activity = require('../models/Activity');

// @desc    Follow a user
// @route   POST /api/users/:id/follow
// @access  Private
const followUser = async (req, res) => {
    try {
        const targetUserId = req.params.id;
        const userId = req.user.id;

        // Cannot follow yourself
        if (targetUserId === userId.toString()) {
            return res.status(400).json({ 
                message: 'Cannot follow yourself' 
            });
        }

        // Check if target user exists
        const targetUser = await User.findById(targetUserId);
        if (!targetUser || !targetUser.isActive) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Check if already following
        const existingFollow = await Follow.findOne({
            follower: userId,
            following: targetUserId
        });

        if (existingFollow) {
            return res.status(400).json({ message: 'Already following' });
        }

        // Create follow relationship
        await Follow.create({
            follower: userId,
            following: targetUserId
        });

        // Create activity
        await Activity.create({
            user: userId,
            type: 'user_followed',
            targetUser: targetUserId,
            metadata: {
                follower: req.user.username,
                following: targetUser.username
            }
        });

        res.json({ message: 'User followed successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Unfollow a user
// @route   DELETE /api/users/:id/follow
// @access  Private
const unfollowUser = async (req, res) => {
    try {
        const targetUserId = req.params.id;
        const userId = req.user.id;

        const follow = await Follow.findOneAndDelete({
            follower: userId,
            following: targetUserId
        });

        if (!follow) {
            return res.status(404).json({ message: 'Follow relationship not found' });
        }

        res.json({ message: 'User unfollowed successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Block a user
// @route   POST /api/users/:id/block
// @access  Private
const blockUser = async (req, res) => {
    try {
        const targetUserId = req.params.id;
        const userId = req.user.id;

        // Cannot block yourself
        if (targetUserId === userId.toString()) {
            return res.status(400).json({ 
                message: 'Cannot block yourself' 
            });
        }

        // Check if target user exists
        const targetUser = await User.findById(targetUserId);
        if (!targetUser || !targetUser.isActive) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Check if already blocked
        const existingBlock = await Block.findOne({
            blocker: userId,
            blocked: targetUserId
        });

        if (existingBlock) {
            return res.status(400).json({ message: 'Already blocked' });
        }

        // Create block relationship
        await Block.create({
            blocker: userId,
            blocked: targetUserId
        });

        // Remove follow relationships in both directions
        await Follow.deleteMany({
            $or: [
                { follower: userId, following: targetUserId },
                { follower: targetUserId, following: userId }
            ]
        });

        res.json({ message: 'User blocked successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Unblock a user
// @route   DELETE /api/users/:id/block
// @access  Private
const unblockUser = async (req, res) => {
    try {
        const targetUserId = req.params.id;
        const userId = req.user.id;

        const block = await Block.findOneAndDelete({
            blocker: userId,
            blocked: targetUserId
        });

        if (!block) {
            return res.status(404).json({ message: 'Block relationship not found' });
        }

        res.json({ message: 'User unblocked successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Get user's followers
// @route   GET /api/users/:id/followers
// @access  Private
const getFollowers = async (req, res) => {
    try {
        const userId = req.params.id;

        const followers = await Follow.find({ following: userId })
            .populate('follower', 'username email')
            .select('-__v');

        res.json(followers);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Get user's following
// @route   GET /api/users/:id/following
// @access  Private
const getFollowing = async (req, res) => {
    try {
        const userId = req.params.id;

        const following = await Follow.find({ follower: userId })
            .populate('following', 'username email')
            .select('-__v');

        res.json(following);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = {
    followUser,
    unfollowUser,
    blockUser,
    unblockUser,
    getFollowers,
    getFollowing
};