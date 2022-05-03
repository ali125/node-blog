import { Router, Request, Response, NextFunction } from 'express';
import postRouters from './posts';
import categoryRouters from './categories';
import tagRouters from './tags';
import settingRouters from './settings';
import userRouters from './users';
import commentRouters from './comments';

const router = Router();

/* GET home page. */
router.get('/', (req: Request, res: Response, next: NextFunction) => {
  res.render('dashboard', { title: 'News and Stories' });
});

router.use('/posts', postRouters);
router.use('/categories', categoryRouters);
router.use('/tags', tagRouters);
router.use('/users', userRouters);
router.use('/comments', commentRouters);
router.use('/settings', settingRouters);

export default router;
