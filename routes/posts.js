var express = require('express');
var router = express.Router();
var multer = require('multer');
const check = require('express-validator').check;
var upload = multer({ dest:'./public/images'});
var mongodb = require('mongodb');
const db = require('monk')('localhost/nodeblog');



router.get('/show/:id', function(req, res, next) {
    var posts = db.get('posts');

    posts.findOne({ _id : req.params.id} ,function(err,post){
        res.render('show',{
            'post':post
        });
    });
});

router.get('/add', function(req, res, next) {
    var categories = db.get('categories');
    categories.find({},{},function(err,categories){
        res.render('addpost',{
            'title':'Add post',
            'categories':categories
        })  
    })
});

router.post('/add',upload.single('mainimage'), function(req, res, next) {
    var title =req.body.title;
    var category =req.body.category;
    var body =req.body.body;
    var author =req.body.author;
    var date =new Date();

    if(req.file){
        var mainimage=req.file.filename
    }else{
        var mainimage = 'noimage.jpg';
    }

    check('title').not().isEmpty().withMessage('must be not empty');  
    check('body').not().isEmpty().withMessage('must be not empty');  

    
        var posts = db.get('posts')
        posts.insert({
            "title":title,
            "body":body,
            "category":category,
            "date":date,
            "author":author,
            "mainimage":mainimage
        },function(err,post){
            if(err){
                res.send(err)
            }else{
                res.location('/');
                res.redirect('/');
            }
        });
    
  });

  router.post('posts/addcomment', function(req, res, next) {
    var name =req.body.name;
    var email =req.body.email;
    var postid = req.body.postid;
    var body =req.body.body;

    check('name').not().isEmpty().withMessage('must be not empty');  
    check('email').not().isEmpty().isEmail().withMessage('must be not empty');  

    var comment={
        "name":name,
        "body":body,
        "email":email
    }
        var posts = db.get('posts')
        posts.update({
            "_id":postid
        },{
            $push:{"comments":comment}
        },function(err,docs){
            if(err) throw err;
            else 
            {
                res.location('/posts/show/'+postid)
                res.redirect('/posts/show/'+postid)
            }
        });
    
  });

module.exports = router;