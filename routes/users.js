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
    cb(null,file.filename+Date.now()+path.extname(file.originalname))
  }
});

const upload= multer({
  storage: storage
}).single('Post')

router.post('/upload',(req,res)=>{
  upload(req,res, (err)=>{
    if (err){
      res.redirect('/users/upload')
    }
    else{
      database(req,res)
    }
  })
})

// Save Details to database 
async function database(req,res){
  var user= new User({
    name:req.body.name,
    email:req.body.email,
    password: User.hashPassword(req.body.password),
    createdAt: Date.now(),
    bio: req.body.bio
  });
  try{
    doc=await user.save()
    return res.redirect('/login')
    //return res.status(201).json(doc);
  }
  catch(err){
    return res.render('register',{"error":"Error saving data! Please try again"})
    //return res.status(501).json(err);
  }
  
}


module.exports = router;
