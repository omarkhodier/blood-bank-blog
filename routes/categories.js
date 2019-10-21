var express = require('express');
var router = express.Router();
const check = require('express-validator').check;
var mongodb = require('mongodb');
const db = require('monk')('localhost/nodeblog');


router.get('/show/:category', function(req, res, next) {
    var posts = db.get('posts');
    posts.find({category:req.params.category},{},function(err,posts){
        res.render('index',{
            'title':req.params.category,
            'posts':posts
        })  
    })
});

router.get('/add', function(req, res, next) {
        res.render('addcategory',{
            'title':'Add category'
        });
});

router.post('/add', function(req, res, next) {
    var name=req.body.name;

    check('name').not().isEmpty().withMessage('must be not empty');  
    
        var categories = db.get('categories')
        categories.insert({
            "name":name
        },function(err,post){
            if(err){
                res.send(err)
            }else{
                res.location('/');
                res.redirect('/');
            }
        });
    
  });

module.exports = router;