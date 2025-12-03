const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
    followUser,
    unfollowUser,
    blockUser,
    unblockUser,
    getFollowers,
    getFollowing
} = require('../controllers/userController');

router.use(protect);

router.post('/:id/follow', followUser);
router.delete('/:id/follow', unfollowUser);
router.post('/:id/block', blockUser);
router.delete('/:id/block', unblockUser);
router.get('/:id/followers', getFollowers);
router.get('/:id/following', getFollowing);

module.exports = router;