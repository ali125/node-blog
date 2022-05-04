import { Router } from 'express';

import * as tagController from '../../controllers/dashboard/tag';
import { tagValidation } from '../../middleware/validations';

const router = Router();

router.get('/', tagController.all);

router.get('/create', tagController.create);

router.post('/create', tagValidation, tagController.save);

router.get('/:tagId/edit', tagController.edit);

router.post('/:tagId/edit', tagValidation, tagController.update);

router.delete('/:tagId', tagController.destroy);

export default router;
