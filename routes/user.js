const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const flash = require("connect-flash");
const {saveRedirectUrl} = require("../middleware.js");

router.get("/signup" , async (req , res)=>{
    res.render("users/signup.ejs");
});

router.post("/signup" , wrapAsync(async (req , res , next)=>{
    try{
        let {username , email , password} = req.body.user;
        const newUser = new User({email , username});
        const registeredUser = await User.register(newUser , password);
        req.login(registeredUser , (err)=>{
            if(err){
                return next(err);
            }
            req.flash("success" , "User Registered Successfully");
            res.redirect("/listing");
        });
    }catch(e){
        req.flash("error" , "User already exists");
        res.redirect("/signup");
    }
}));

router.get("/login" ,(req , res)=>{
    res.render("users/login.ejs");
});

router.post("/login", saveRedirectUrl , passport.authenticate("local" , {failureRedirect: "/login" , failureFlash: true}) , async (req , res)=>{
    req.flash("success","Successfull Login... Welcome Back!");
    const redirectUrl = res.locals.redirectUrl || "/listing";
    res.redirect(redirectUrl);
});

router.get("/logout" , (req , res , next)=>{
    req.logout((err)=>{
        if(err){
            return next(err);
        }
        req.flash("success" , "Logged Out Successfully");
        res.redirect("/listing");
    })
})

module.exports = router;