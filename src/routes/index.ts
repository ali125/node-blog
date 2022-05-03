import { Router } from 'express';
import postController from '../controllers/post';
import commentController from '../controllers/comment';

const router = Router();
/* GET home page. */
router.get('/', postController.index);
router.get('/posts', postController.search);
router.get('/posts/:slug', postController.get);

router.post('/posts/:postId/comment', commentController.save);

export default router;
