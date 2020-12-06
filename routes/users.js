var express = require('express');
var router = express.Router();
var Post = require('../models/post');
const User = require('../models/user');
const passport = require('passport');
const multer = require ("multer")
const path = require("path");
const { SlowBuffer } = require('buffer');


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
  res.render("upload",{userispresent:'present'})
})

router.post('/upload',(req,res)=>{
 
    console.log('Here')
    upload(req,res, (err)=>{
      if (err){
        console.log(err)
        console.log('Here')
        res.redirect('/users/upload')
      }
      else{
        console.log('Here')
        database(req,res)
      }
    })
  
})

// Save Details to database 
async function database(req,res){
  User.findOne({_id:req.user._id}).then( async result=>{
    const url = req.file.filename ? '/uploads/'+req.file.filename : ''
    const post= new Post({
      text: req.body.text,
      url: url ,
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
      console.log(err)
      return res.render('upload')
      //return res.status(501).json(err);
    } 
  }) 
}

router.get('/feed',async (req,res)=>{
  const posts = await Post.aggregate([
    { $match: { verified: true } },
    { $sample: { size: 10 } }
])
  if (req.user){
    res.render("feed",{userispresent:'present',posts:posts})
  }
  else{
  res.render("feed",{posts:posts})
}
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
