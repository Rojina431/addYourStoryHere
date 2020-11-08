const express=require('express');
const router=express.Router();

router.get('/',(req,res)=>{
    res.render('login')
})

router.get('/dashboard',(req,res)=>{
    res.render('dashboard')
})

router.route('/')
.get((req,res)=>{
    res.send('login') 
})

/*router.route('/')
.get((req,res)=>{
    res.render('login') 
})

router.route('/dashboard')
.get((req,res)=>{
    res.render('dashboard') 
})*/

module.exports=router