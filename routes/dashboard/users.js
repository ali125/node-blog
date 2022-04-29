const express = require('express');
const router = express.Router();

const userController = require('../../controllers/user');
const { userValidation, updateUserValidation } = require('../../middleware/validations');

router.get('/', userController.all);

router.get('/create', userValidation, userController.create);

router.post('/create', userValidation, userController.save);

router.get('/:userId/edit', userController.edit);

router.post('/:userId/edit', updateUserValidation, userController.update);

router.delete('/:userId', userController.destroy);

module.exports = router;
