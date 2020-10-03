const express = require('express');
const router = express.Router();
const PostController = require('../controllers/post');

router.get('/', PostController.getPosts);
router.get('/:id', PostController.getPost);

module.exports = router;
