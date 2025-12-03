const Activity = require('../models/Activity');
const Block = require('../models/Block');

// @desc    Get activity feed
// @route   GET /api/feed
// @access  Private
const getFeed = async (req, res) => {
    try {
        const userId = req.user.id;

        // Get list of blocked users
        const blockedUsers = await Block.find({ blocker: userId })
            .select('blocked');
        const blockedUserIds = blockedUsers.map(b => b.blocked);

        // Get activities, excluding those from blocked users
        const activities = await Activity.find({
            isVisible: true,
            user: { $nin: blockedUserIds }
        })
        .populate('user', 'username')
        .populate('targetUser', 'username')
        .populate('targetPost', 'content')
        .sort({ createdAt: -1 })
        .limit(100);

        // Format activities for display
        const formattedActivities = activities.map(activity => {
            let message = '';
            
            switch (activity.type) {
                case 'post_created':
                    message = `${activity.user.username} made a post`;
                    break;
                case 'post_liked':
                    message = `${activity.user.username} liked ${activity.targetUser?.username}'s post`;
                    break;
                case 'user_followed':
                    message = `${activity.user.username} followed ${activity.targetUser?.username}`;
                    break;
                default:
                    message = `${activity.user.username} performed an action`;
            }

            return {
                id: activity._id,
                type: activity.type,
                message,
                user: activity.user,
                targetUser: activity.targetUser,
                targetPost: activity.targetPost,
                createdAt: activity.createdAt,
                metadata: activity.metadata
            };
        });

        res.json(formattedActivities);
    } catch (error) {
        console.error('Feed error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Get user's activity
// @route   GET /api/feed/user/:userId
// @access  Private
const getUserActivity = async (req, res) => {
    try {
        const targetUserId = req.params.userId;

        const activities = await Activity.find({
            user: targetUserId,
            isVisible: true
        })
        .populate('user', 'username')
        .populate('targetUser', 'username')
        .populate('targetPost', 'content')
        .sort({ createdAt: -1 })
        .limit(50);

        res.json(activities);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = {
    getFeed,
    getUserActivity
};