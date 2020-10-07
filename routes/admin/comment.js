const express = require('express');
const router = express.Router();
const adminCommentController = require('../../controllers/admin/comment');

router.get('/', adminCommentController.getComments);
router.get('/:id', adminCommentController.getComment);
router.post('/:id', adminCommentController.saveReply);


module.exports = router;
