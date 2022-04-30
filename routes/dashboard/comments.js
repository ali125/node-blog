const express = require('express');
const router = express.Router();

// const { commentValidation } = require('../../middleware/validations');
const commentController = require('../../controllers/dashboard/comment');

router.get('/', commentController.all);

router.get('/:commentId/view', commentController.view);
router.post('/:commentId/reply', commentController.reply);

// router.get('/create', commentController.create);

// router.post('/create', upload.single('image'), commentValidation, commentController.save);

// router.get('/:commentId/edit', commentController.edit);

// router.post('/:commentId/edit', upload.single('image'), commentValidation, commentController.update);

// router.delete('/:commentId', commentController.destroy);

module.exports = router;
