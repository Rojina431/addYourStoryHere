const express=require('express');
const passport = require('passport');
const router=express.Router();

router.get('/google',passport.authenticate('google',{
    scope:['profile']
}))

router.get('/google/callback',
passport.authenticate('google',{failureRedirect:'/login'}),
(req,res)=>{
 res.redirect('/dashboard');
}
)


module.exports=router