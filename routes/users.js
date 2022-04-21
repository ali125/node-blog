var express = require('express');
var router = express.Router();
const User = require('../models/user');
const Post = require('../models/post');

/* GET users listing. */
router.get('/', function(req, res, next) {
  User.findAll({
    include: Post
  }).then((users) => {
    console.log('users', users);
    res.json({ users });
  })
  // res.send('respond with a resource');
});

module.exports = router;
