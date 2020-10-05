const express = require('express');
const fileHelper = require('../../util/file');

const validations = require('../../middleware/validations');
const router = express.Router();
const adminUserController = require('../../controllers/admin/user');

router.get('/profile', adminUserController.getProfile);
router.post('/profile', fileHelper.uploadImageFile('file', 'images/avatars/'), validations.userValidation, adminUserController.saveProfile);

module.exports = router;
