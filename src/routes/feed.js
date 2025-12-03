const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { getFeed, getUserActivity } = require('../controllers/feedController');

router.use(protect);

router.get('/', getFeed);
router.get('/user/:userId', getUserActivity);

module.exports = router;