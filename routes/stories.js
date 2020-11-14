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
    res.render('/dashboard');
   }catch(e){
       console.log(error);
       res.render('error/500')
   }
})

//get public story
router.get('/',ensureAuth,async (req,res)=>{
    try{
       const stories=await Story.find({status:"public"})
       .populate('user')
       .sort({createdAt:'desc'})
       .lean()

       res.render('story/index',{
           stories,
       });
    }catch(err){
        console.log(err)
        res.redirect('error/500')
    }
})

module.exports=router