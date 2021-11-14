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
    const stories=await Story.create(req.body)
    const allstories=await Story.find({user:req.user.id})
    res.redirect('/dashboard')
   }catch(e){
       console.log(e);
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

//edit added story
router.get('/edit/:id',ensureAuth,async(req,res)=>{
     const story=await Story.findOne({_id:req.params.id}).lean()
     if(!story){
         res.render('error/404')
     }
     if(story.user!=req.user.id){
         res.redirect('/stories')
     }else{
         res.render('story/edit',{
             story
         })
     }
})

//update  story
router.put('/:id',ensureAuth,async(req,res)=>{
    let story=await Story.findById(req.params.id).lean() 
    if(!story){
        res.render('error/404')
    }
    if(story.user!=req.user.id){
        res.redirect('/stories')
    }else{
        let story=await Story.findOneAndUpdate({_id:req.params.id},req.body,{
            new:true,
            runValidators:true
        })
        res.redirect('/dashboard')
    }
})

//delete added story
router.delete('/:id',ensureAuth,async (req,res)=>{
    try {
        let story=await Story.findById(req.params.id).lean()
        if(!story){
            res.render('error/404')
        }else{
                await Story.findByIdAndRemove({_id:req.params.id})
                res.redirect('/dashboard')
        }
    } catch (error) {
        console.log(err);
        res.render('error/500')
    }
  
})

//get single story
router.get('/:id',ensureAuth,async (req,res)=>{
    try{
       const story=await Story.findById(req.params.id).populate('user').lean()
      if(!story){
          res.render('error/404')
      }else{
          if(story.user._id!=req.user.id){
            res.render('error/404')  
          }else{
            res.render('story/show',{
                story,
            });
          }
      }
    }catch(err){
        console.log(err)
        res.render('error/500')
    }
})

//get more stories from single user
router.get('/user/:userId',ensureAuth,async (req,res)=>{
    try{
       const stories=await Story.find({user:req.params.userId,status:"public"}).populate('user').lean()
       res.render('story/index', {
        stories,
       })
    }catch(err){
        console.log(err)
        res.render('error/500')
    }
})

module.exports=router