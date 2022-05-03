const express from 'express';
const router = express.Router();

const userController from '../../controllers/dashboard/user';
const { userValidation, updateUserValidation } from '../../middleware/validations';

router.get('/', userController.all);

router.get('/create', userValidation, userController.create);

router.post('/create', userValidation, userController.save);

router.get('/:userId/edit', userController.edit);

router.post('/:userId/edit', updateUserValidation, userController.update);

router.delete('/:userId', userController.destroy);

export default router;
