import { Router } from 'express';
import multer from 'multer';

import { postValidation } from '../../middleware/validations';
import postController from '../../controllers/dashboard/post';
import { imageDirectory } from '../../config';

const router = Router();

const upload = multer({ dest: imageDirectory })

router.get('/', postController.all);

router.get('/create', postController.create);

router.post('/create', upload.single('image'), postValidation, postController.save);

router.get('/:postId/edit', postController.edit);

router.post('/:postId/edit', upload.single('image'), postValidation, postController.update);

router.delete('/:postId', postController.destroy);

export default router;
