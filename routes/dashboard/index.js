var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('dashboard', { title: 'News and Stories' });
});

router.get('/posts', function(req, res, next) {
  res.render('dashboard/posts', { title: 'News and Stories' });
});
router.get('/posts/add', function(req, res, next) {
  res.render('dashboard/posts/form', { title: 'News and Stories' });
});
router.get('/posts/:postId', function(req, res, next) {
  res.render('dashboard/posts/form', { title: 'News and Stories' });
});

router.get('/categories', function(req, res, next) {
  res.render('dashboard/categories', { title: 'News and Stories' });
});
router.get('/categories/add', function(req, res, next) {
  res.render('dashboard/categories/form', { title: 'News and Stories' });
});
router.get('/categories/:postId', function(req, res, next) {
  res.render('dashboard/categories/form', { title: 'News and Stories' });
});

router.get('/tags', function(req, res, next) {
  res.render('dashboard/tags', { title: 'News and Stories' });
});
router.get('/tags/add', function(req, res, next) {
  res.render('dashboard/tags/form', { title: 'News and Stories' });
});
router.get('/tags/:postId', function(req, res, next) {
  res.render('dashboard/tags/form', { title: 'News and Stories' });
});

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

router.get('/settings', function(req, res, next) {
  res.render('dashboard/settings', { title: 'News and Stories' });
});

router.get('/settings/profile', function(req, res, next) {
  res.render('dashboard/settings/profile', { title: 'News and Stories' });
});

module.exports = router;
