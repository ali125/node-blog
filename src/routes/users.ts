import { Router } from 'express';
import User from '../models/user';
import Post from '../models/post';

const router = Router();
/* GET users listing. */
router.get('/', function(req, res, next) {
  User.findAll({
    include: Post
  }).then((users: any) => {
    console.log('users', users);
    res.json({ users });
  })
  // res.send('respond with a resource';
});

export default router;
