const express=require('express')
const router=express.Router()
const {ensureAuth}=require('../middleware/auth.js')
const Article=require('../model/article.js')
const moment=require('moment')

// handling add request of user
router.get("/add",ensureAuth,(req,res)=>{
    res.render("article/add",{
        user:req.user,
    })
})

router.post("/add",ensureAuth,async(req,res)=>{
    req.body.user = req.user.id;
    // console.log(req.body);
    await Article.create(req.body)
    res.redirect('/dashboard')
})

//individual article
router.get("/individual/:id",ensureAuth,async(req,res)=>{
    const article=await Article.findById({_id:req.params.id})
    res.render("article/individual",{
        article:article,
        moment:moment,
    })
})

//delete
router.get("/delete/:id",ensureAuth,async(req,res)=>{
    await Article.findOneAndDelete({_id:req.params.id})
    res.redirect('/dashboard')
})

//edit
router.get("/edit/:id",ensureAuth,async(req,res)=>{
    const oData=await Article.findOne({_id:req.params.id})
    res.render("article/edit",{
        data:oData,
    })
})

router.post("/edit",ensureAuth,async(req,res)=>{
    let data=await Article.findOneAndUpdate({_id:req.body._id},{$set:{title:req.body.title,status:req.body.status,body:req.body.body}},{new:true})
    res.redirect('/dashboard')
})

router.post("/",ensureAuth,(req,res)=>{
    
})
module.exports=router