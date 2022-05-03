import { Router } from 'express';
import multer from 'multer';

import userController from '../../controllers/dashboard/user';
import { profileValidation, changePasswordValidation } from '../../middleware/validations';
import { imageDirectory } from '../../config';

const router = Router();

const upload = multer({ dest: imageDirectory })

router.get('/', (req, res, next) => {
    try {
        res.render('dashboard/settings';
    } catch (e) {
        next(e);
    }
});

router.get('/profile', userController.profileView);

router.post('/profile', upload.single('avatar'), profileValidation, userController.profileSave);

router.get('/change-password', userController.changePasswordView);

router.post('/change-password', changePasswordValidation, userController.changePasswordSave);

router.delete('/delete-account', userController.deleteAccount);

export default router;
