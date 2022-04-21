var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('web/index', { title: 'News and Stories' });
});

router.get('/posts', function(req, res, next) {
  res.render('web/index', { title: 'News and Stories' });
});

router.get('/posts/:id', function(req, res, next) {
  res.render('web/post', { title: 'Express' });
});

module.exports = router;
