const express = require('express');
const {postValidation} = require('../../middleware/validations');
const router = express.Router();
const adminPostController = require('../../controllers/admin/post');

router.get('/', adminPostController.getPosts);
router.get('/add', adminPostController.addPost);
router.post('/add', postValidation, adminPostController.savePost);

module.exports = router;
