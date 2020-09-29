const express = require('express');
const router = express.Router();
const adminPostController = require('../../controllers/admin/post');

router.get('/', adminPostController.getPosts);
router.get('/add', adminPostController.addPost);
router.post('/add', adminPostController.savePost);

module.exports = router;
