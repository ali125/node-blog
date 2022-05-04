import { Router } from 'express';

import * as commentController from '../../controllers/dashboard/comment';

const router = Router();

router.get('/', commentController.all);
router.get('/:commentId/view', commentController.view);
router.post('/:commentId/reply', commentController.reply);
router.post('/:commentId/junk', commentController.junk);
router.post('/:commentId/active', commentController.active);

export default router;
