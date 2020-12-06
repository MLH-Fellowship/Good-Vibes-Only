var express = require('express');
var router = express.Router();
var Post = require('../models/post');
const User = require('../models/user');
const passport = require('passport');
const multer = require ("multer")
const path = require("path")


/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

const storage = multer.diskStorage({
  destination:'./public/uploads/',
  filename: (req,file,cb)=>{
    cb(null,file.fieldname+Date.now()+path.extname(file.originalname))
  }
});

const upload= multer({
  storage: storage
}).single('myImage')

router.get('/upload',isValidUser,(req,res)=>{
  res.render("upload")
})

router.post('/upload',(req,res)=>{
  console.log(req)
  upload(req,res, (err)=>{
    if (err){
      console.log(err)
      res.redirect('/users/upload')
    }
    else{
      database(req,res)
    }
  })
})

// Save Details to database 
async function database(req,res){
  User.findOne({_id:req.user._id}).then( async result=>{

    var post= new Post({
      text: req.body.text,
      url: './public/uploads/'+req.file.filename,
      type: req.body.type,
      name: result.name, 
      userid:result._id,
      verified:true
    });
    try{
      doc=await post.save()
      return res.redirect('/users/feed')
      //return res.status(201).json(doc);
    }
    catch(err){
      return res.render('upload')
      //return res.status(501).json(err);
    } 
  }) 
}

router.get('/feed',(req,res)=>{
  const posts = Post.aggregate([[ { $sample: { size: 10 } } ]])
  res.render("feed",{posts:posts})
})

function isValidUser(req,res,next){
  if(req.isAuthenticated()){
    next()
  }
  else{
    console.log('Unauthorized request')
    res.redirect('/login')
  //return res.status(401).json({message:'Unauthorized Request'});
  }
}


module.exports = router;
