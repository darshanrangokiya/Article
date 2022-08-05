const express=require('express')
const passport = require('passport')
const router=express.Router()
const User =require('../model/user.js')
// handling add request of user
router.get('/google',
  passport.authenticate('google', { scope: ['profile'] }));
// google callback
router.get(
    "/google/callback",
    passport.authenticate("google",{
        failureRedirect:"/",
    }),
    (req,res)=>{
        res.redirect("/dashboard");
}
)

// log out user
router.get("/logout",(req,res)=>{
    req.logOut()
    res.redirect('/');
})

module.exports=router