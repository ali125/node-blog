const express = require('express');
const fileHelper = require('../../util/file');

const {postValidation} = require('../../middleware/validations');
const router = express.Router();
const adminPostController = require('../../controllers/admin/post');

router.get('/', adminPostController.getPosts);
router.get('/add', adminPostController.addPost);
router.post('/add', fileHelper.uploadImageFile(), postValidation, adminPostController.savePost);
router.get('/:id/edit', adminPostController.editPost);
router.post('/:id/edit', fileHelper.uploadImageFile(), postValidation, adminPostController.updatePost);
router.get('/:id/delete', adminPostController.deletePost);

router.get('/file/:id', adminPostController.createGetFile);

module.exports = router;
