const express = require('express');
const multer = require('multer');
const router = express.Router();

const categoryController = require('../../controllers/category');
const { imageDirectory } = require('../../config');
const { categoryValidation } = require('../../middleware/validations');

const upload = multer({ dest: imageDirectory })

router.get('/', categoryController.all);

router.get('/create', categoryController.create);

router.post('/create', categoryValidation, upload.single('image'), categoryController.save);

router.get('/:categoryId/edit', categoryController.edit);

router.post('/:categoryId/edit', categoryValidation, upload.single('image'), categoryController.update);

router.delete('/:categoryId', categoryController.destroy);

module.exports = router;
