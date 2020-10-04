const express = require('express');
const router = express.Router();
const validations = require('../middleware/validations');
const MessageController = require('../controllers/message');

router.get('/contact-us', MessageController.getMessage);
router.post('/contact-us', validations.messageValidation , MessageController.saveMessage);

module.exports = router;
