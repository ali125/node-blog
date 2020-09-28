const express = require('express');
const router = express.Router();
const PostController = require('../controllers/post');

router.get('/', PostController.getPosts);
router.get('/add', PostController.addPost);
router.post('/add', PostController.savePost);

module.exports = router;
