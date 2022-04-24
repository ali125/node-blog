const express = require('express');
const multer = require('multer');
const router = express.Router();

const categoryController = require('../../controllers/category');
const { imageDirectory } = require('../../config');

const upload = multer({ dest: imageDirectory })

router.get('/', categoryController.all);

router.get('/create', categoryController.create);

router.post('/create', upload.single('image'), categoryController.save);

router.get('/:categoryId/edit', categoryController.edit);

router.post('/:categoryId/edit', upload.single('image'), categoryController.update);

router.delete('/:categoryId', categoryController.destroy);

module.exports = router;
