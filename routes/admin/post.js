const express = require('express');
const {postValidation} = require('../../middleware/validations');
const router = express.Router();
const adminPostController = require('../../controllers/admin/post');

router.get('/', adminPostController.getPosts);
router.get('/add', adminPostController.addPost);
router.post('/add', postValidation, adminPostController.savePost);
router.get('/:id/edit', adminPostController.editPost);
router.post('/:id/edit', adminPostController.updatePost);
router.get('/:id/delete', adminPostController.deletePost);

module.exports = router;
