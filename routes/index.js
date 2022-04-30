const express = require('express');
const router = express.Router();
const postController = require('../controllers/post');
const commentController = require('../controllers/comment');

/* GET home page. */
router.get('/', postController.index);
router.get('/posts', postController.search);
router.get('/posts/:slug', postController.get);

router.post('/posts/:postId/comment', commentController.save);

module.exports = router;
