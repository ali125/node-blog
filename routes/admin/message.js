const express = require('express');
const validations = require('../../middleware/validations');
const router = express.Router();
const adminMessageController = require('../../controllers/admin/message');

router.get('/', adminMessageController.getMessages);
router.get('/:id', adminMessageController.getMessage);
router.post('/:id', validations.replyMessageValidation, adminMessageController.saveReply);

module.exports = router;
