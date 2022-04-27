const express = require('express');
const multer = require('multer');
const router = express.Router();

const userController = require('../../controllers/user');
const { profileValidation, changePasswordValidation } = require('../../middleware/validations');
const { imageDirectory } = require('../../config');

const upload = multer({ dest: imageDirectory })

router.get('/', (req, res, next) => {
    try {
        res.render('dashboard/settings');
    } catch (e) {
        next(e);
    }
});

router.get('/profile', userController.profileView);

router.post('/profile', upload.single('avatar'), profileValidation, userController.profileSave);

router.get('/change-password', userController.changePasswordView);

router.post('/change-password', changePasswordValidation, userController.changePasswordSave);

router.delete('/delete-account', userController.deleteAccount);

module.exports = router;
