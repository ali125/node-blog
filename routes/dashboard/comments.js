const express = require('express');
const router = express.Router();

const commentController = require('../../controllers/dashboard/comment');

router.get('/', commentController.all);

router.get('/:commentId/view', commentController.view);
router.post('/:commentId/reply', commentController.reply);
router.post('/:commentId/junk', commentController.junk);
router.post('/:commentId/active', commentController.active);

module.exports = router;
