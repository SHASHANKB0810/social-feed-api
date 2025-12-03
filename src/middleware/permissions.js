const User = require('../models/User');

const isAdmin = (req, res, next) => {
    if (req.user && (req.user.role === 'admin' || req.user.role === 'owner')) {
        next();
    } else {
        res.status(403).json({ message: 'Access denied. Admin privileges required.' });
    }
};

const isOwner = (req, res, next) => {
    if (req.user && req.user.role === 'owner') {
        next();
    } else {
        res.status(403).json({ message: 'Access denied. Owner privileges required.' });
    }
};

const checkPermission = (resourceType, action) => {
    return async (req, res, next) => {
        try {
            const userId = req.user._id;
            const isResourceOwner = req.params.userId === userId.toString();
            
            switch (resourceType) {
                case 'user':
                    if (req.user.role === 'owner') {
                        return next();
                    }
                    if (action === 'delete' && req.user.role === 'admin') {
                        const targetUser = await User.findById(req.params.userId);
                        if (targetUser && targetUser.role === 'owner') {
                            return res.status(403).json({ 
                                message: 'Cannot delete owner account' 
                            });
                        }
                        return next();
                    }
                    break;
                    
                case 'post':
                    if (req.user.role === 'owner' || req.user.role === 'admin') {
                        return next();
                    }
                    if (isResourceOwner) {
                        return next();
                    }
                    break;
                    
                default:
                    return res.status(403).json({ message: 'Permission denied' });
            }
            
            res.status(403).json({ message: 'Permission denied' });
        } catch (error) {
            res.status(500).json({ message: 'Server error' });
        }
    };
};

module.exports = { isAdmin, isOwner, checkPermission };