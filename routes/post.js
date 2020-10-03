const express = require('express');
const router = express.Router();
const validations = require('../middleware/validations');
const PostController = require('../controllers/post');

router.get('/', PostController.getPosts);
router.get('/:id', PostController.getPost);
router.post('/:id/comment', validations.commentPostValidation, PostController.saveComment);

module.exports = router;
