const express = require('express');
const router = express.Router();
const postRouters = require('./posts');
const categoryRouters = require('./categories');
const tagRouters = require('./tags');
const settingRouters = require('./settings');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('dashboard', { title: 'News and Stories' });
});

router.use('/posts', postRouters);
router.use('/categories', categoryRouters);
router.use('/tags', tagRouters);
router.use('/settings', settingRouters);

router.get('/users', function(req, res, next) {
  res.render('dashboard/users', { title: 'News and Stories' });
});
router.get('/users/add', function(req, res, next) {
  res.render('dashboard/users/form', { title: 'News and Stories' });
});
router.get('/users/:postId', function(req, res, next) {
  res.render('dashboard/users/form', { title: 'News and Stories' });
});

router.get('/skills', function(req, res, next) {
  res.render('dashboard/skills', { title: 'News and Stories' });
});
router.get('/skills/add', function(req, res, next) {
  res.render('dashboard/skills/form', { title: 'News and Stories' });
});
router.get('/skills/:postId', function(req, res, next) {
  res.render('dashboard/skills/form', { title: 'News and Stories' });
});

router.get('/comments', function(req, res, next) {
  res.render('dashboard/comments', { title: 'News and Stories' });
});

module.exports = router;
