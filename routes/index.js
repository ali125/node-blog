const express = require('express');
const router = express.Router();
const postController = require('../controllers/post');

/* GET home page. */
router.get('/', postController.index);
router.get('/posts', postController.search);

router.get('/posts/:slug', postController.get);

module.exports = router;
