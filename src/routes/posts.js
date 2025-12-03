const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { checkPermission } = require('../middleware/permissions');
const {
    createPost,
    getPosts,
    likePost,
    unlikePost,
    deletePost
} = require('../controllers/postController');

router.use(protect);

router.route('/')
    .post(createPost)
    .get(getPosts);

router.route('/:id')
    .delete(deletePost);

router.post('/:id/like', likePost);
router.delete('/:id/like', unlikePost);

module.exports = router;