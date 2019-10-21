var express = require('express');
var router = express.Router();
var mongodb = require('mongodb');
const db = require('monk')('localhost/nodeblog');


/* GET home page. */
router.get('/', function(req, res,next) {
  req.db = req;
  var posts = db.get('posts');
  posts.find({},{},function(err,posts){
    res.render('index', { posts:posts });

  })
});

module.exports = router;
