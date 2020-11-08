const express=require('express');
const router=express.Router();

router.get('/',(req,res)=>{
    res.send('login')
})

router.get('/dashboard',(req,res)=>{
    res.send('dashboard')
})

router.route('/')
.get((req,res)=>{
    res.send('login') 
})

/*router.route('/')
.get((req,res)=>{
    res.send('login') 
})

router.route('/dashboard')
.get((req,res)=>{
    res.send('dashboard') 
})*/

module.exports=router