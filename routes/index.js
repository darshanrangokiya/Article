const express=require('express')
const router=express.Router();
const {ensureAuth,ensureGuest}=require('../middleware/auth.js')
const Article=require('../model/article.js')
const moment=require('moment')

router.get('/',ensureGuest,(req,res)=>{
    res.render("login")
})

router.get("/dashboard",ensureAuth,async(req,res)=>{
    try{
        const article=await Article.find({user:req.user.id}).lean();
        // console.log(req.user);
        res.render("dashboard",{
            user:req.user,
            article:article,
            moment:moment,
        })
    }catch(e){
        console.log(e);
    }
})

module.exports=router;