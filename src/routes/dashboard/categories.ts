import { Router } from 'express';
import multer from 'multer';

import * as categoryController from '../../controllers/dashboard/category';
import { imageDirectory } from '../../config';
import { categoryValidation } from '../../middleware/validations';

const router = Router();

const upload = multer({ dest: imageDirectory })

router.get('/', categoryController.all);

router.get('/create', categoryController.create);

router.post('/create', categoryValidation, upload.single('image'), categoryController.save);

router.get('/:categoryId/edit', categoryController.edit);

router.post('/:categoryId/edit', categoryValidation, upload.single('image'), categoryController.update);

router.delete('/:categoryId', categoryController.destroy);

export default router;
