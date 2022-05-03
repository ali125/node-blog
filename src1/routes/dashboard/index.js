const express = require('express');
const router = express.Router();
const postRouters = require('./posts');
const categoryRouters = require('./categories');
const tagRouters = require('./tags');
const settingRouters = require('./settings');
const userRouters = require('./users');
const commentRouters = require('./comments');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('dashboard', { title: 'News and Stories' });
});

router.use('/posts', postRouters);
router.use('/categories', categoryRouters);
router.use('/tags', tagRouters);
router.use('/users', userRouters);
router.use('/comments', commentRouters);
router.use('/settings', settingRouters);

module.exports = router;
