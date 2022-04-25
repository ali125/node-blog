const express = require('express');
const router = express.Router();

const tagController = require('../../controllers/tag');
const { tagValidation } = require('../../middleware/validations');

router.get('/', tagController.all);

router.get('/create', tagController.create);

router.post('/create', tagValidation, tagController.save);

router.get('/:tagId/edit', tagController.edit);

router.post('/:tagId/edit', tagValidation, tagController.update);

router.delete('/:tagId', tagController.destroy);

module.exports = router;
