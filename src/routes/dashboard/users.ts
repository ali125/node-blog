import { Router } from 'express';

import * as userController from '../../controllers/dashboard/user';
import { userValidation, updateUserValidation } from '../../middleware/validations';

const router = Router();

router.get('/', userController.all);

router.get('/create', userValidation, userController.create);

router.post('/create', userValidation, userController.save);

router.get('/:userId/edit', userController.edit);

router.post('/:userId/edit', updateUserValidation, userController.update);

router.delete('/:userId', userController.destroy);

export default router;
