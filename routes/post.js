const express = require('express');
const router = express.Router();
const PostController = require('../controllers/post');

router.get('/', PostController.getPosts);
router.get('/:id', PostController.getPosts);

module.exports = router;
