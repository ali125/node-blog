const express = require('express');
const multer = require('multer');
const router = express.Router();

const postController = require('../../controllers/post');
const { imageDirectory } = require('../../config');

const upload = multer({ dest: imageDirectory })

router.get('/', postController.all);

router.get('/create', postController.create);

router.post('/create', upload.single('image'), postController.save);

router.get('/:postId/edit', postController.edit);

router.post('/:postId/edit', upload.single('image'), postController.update);

router.delete('/:postId', postController.destroy);

module.exports = router;
