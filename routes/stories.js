const express=require('express');
const router=express.Router();
const { ensureAuth}=require('../middleware/auth');
const Story=require('../models/Story')

//get added story
router.get('/add',ensureAuth,(req,res)=>{
    res.render('story/add')
})

//post story
router.post('/',ensureAuth,async (req,res)=>{
   try{
    req.body.user=req.user.id
    await Story.create(req.body)
    res.redirect('/dashboard');
   }catch(e){
       console.log(error);
       res.render('error/500')
   }

})

module.exports=router