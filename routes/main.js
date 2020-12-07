var express = require('express');
var router = express.Router();
var User = require('../models/user');
var Post = require('../models/post');
const passport = require('passport');

const $ = require('jquery')

/* GET home page. */
router.get("/", function (req, res, next) {
  if(req.user){
    return res.redirect('/users/feed')
  }
  res.render("index");
});

// Get register Page
router.get('/register',function(req,res,next){
  if(req.user){
    res.render('register',{userispresent:'present'})
  }
  else{
    res.render('register')
  }
  
})

//Post Request on Register Page
router.post('/register',function(req,res,next){
  console.log(req.body)
  if (req.body.password!==req.body.cpassword){
    return res.render('register',{"error":"Passwords dont match"})
  }
  else{
    database(req,res);
  }
  
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

//Get Login Page
router.get('/login',function(req,res,next){
  if(req.user){
    res.render('login',{userispresent:'present'})
  }
  else{
  res.render('login')
}
})

//Post Request on Login Page
router.post('/login',function(req,res,next){
  passport.authenticate('local', function(err,user,info){
    if (err){ return res.render('login',{"error":"Invalid email/password"});}
    if (!user){  return res.render('login',{"error":"Invalid email/password"})}
    req.login(user,function(err){
      if(err){ return res.status(501).json(err);}
      return res.redirect('/users/feed')
    });
  })(req, res, next);
});

router.get('/google', passport.authenticate('google', { scope: ['https://www.googleapis.com/auth/plus.login', 'https://www.googleapis.com/auth/userinfo.email', 'https://www.googleapis.com/auth/userinfo.profile'] }))

router.get('/google/callback', passport.authenticate('google', { failureRedirect: '/err' }), (req, res) => {
  req.login(req.session.passport.user,function(err){
    if(err){ return res.status(501).json(err);}
   
        return res.redirect('/users/feed');
      
   
    //return res.status(200).json({message:'Login Successful'});

  });
})

router.get('/logout',isValidUser,function(req,res,next){
  req.logout();
  res.redirect('/')
  //return res.status(200).json({message:'Logout Successful'});
});


router.get('/settings',isValidUser, async(req,res,next) => {
  user = await User.findOne({_id:req.user._id})
  res.render('settings',{user,userispresent:'present'})
})

router.post('/settings',async(req,res,next) => {
  try{
    user = await User.findByIdAndUpdate({_id:req.user._id},{
      name:req.body.name,
      bio:req.body.bio
    })
    user1 = await Post.updateMany({userid:req.user._id},{
      name:req.body.name,
    })
    res.render('updateSuccessful')
  }
  catch(err){
    res.render('updateFailed',{err})
  }
})

router.get('/updatepassword',isValidUser,(req,res,next) => {
  res.render('updatePassword',{ userispresent:'present'})
})

router.post('/updatepassword',isValidUser,async (req,res,next) => {
  User.findOne({_id:req.user._id},async function (err,user){
    if(err){ return res.render('updateFailed',{err}) }
    if(!user.isValid(req.body.password)){
        return res.render('updateFailed',{err:'Incorrect password'})
    }
    if (req.body.npassword != req.body.npassword2){
      return res.render('updateFailed',{err:'Passwords donot match'})
  }
  try{
    user = await User.findByIdAndUpdate({_id:req.user._id},{
      password: User.hashPassword(req.body.npassword),
    })
    res.render('updateSuccessful')
  }
  catch(err){
    res.render('updateFailed',{err})
  }
    
})
})

router.get('/settings',(req,res,next) => {
  res.render('settings',{ title: "Good Vibes Only 💕" })
})

router.get('/updatepassword',(req,res,next) => {
  res.render('updatePassword',{ title: "Good Vibes Only 💕" })
})

router.get('/admin',(req,res,next) => {
  res.render('approvals',{ title: "Good Vibes Only 💕", posts: [{url: '', text: '', name: '', type: ''}]})
})

router.post('/approve',(req,res,next) => {
  //do stuff here
})

router.post('/disapprove',(req,res,next) => {
  //do stuff here
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