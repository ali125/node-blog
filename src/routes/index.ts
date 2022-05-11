import { Router } from 'express';
import * as postController from '../controllers/post';
import * as commentController from '../controllers/comment';
import * as webController from '../controllers';

const router = Router();
/* GET home page. */
router.get('/', postController.index);
router.get('/posts', postController.search);
router.get('/posts/:slug', postController.get);
router.post('/posts/:postId/comment', commentController.save);

router.get('/about', webController.AboutUs);
router.get('/contact', webController.Contact);
router.post('/contact', webController.ContactPost);

export default router;
