const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { isAdmin, isOwner } = require('../middleware/permissions');
const {
    getAllUsers,
    deleteUser,
    makeAdmin,
    removeAdmin,
    adminDeletePost,
    adminDeleteLike,
    getStats
} = require('../controllers/adminController');

router.use(protect);

// Admin routes
router.get('/users', isAdmin, getAllUsers);
router.delete('/posts/:id', isAdmin, adminDeletePost);
router.delete('/likes/:id', isAdmin, adminDeleteLike);
router.get('/stats', isAdmin, getStats);

// Owner-only routes
router.delete('/users/:id', isOwner, deleteUser);
router.post('/users/:id/make-admin', isOwner, makeAdmin);
router.post('/users/:id/remove-admin', isOwner, removeAdmin);

module.exports = router;