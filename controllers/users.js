const User = require("../models/user.js");

module.exports.signupForm = async (req , res)=>{
    res.render("users/signup.ejs");
}

module.exports.signup = async (req , res , next)=>{
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
}

module.exports.loginForm = (req , res)=>{
    res.render("users/login.ejs");
}

module.exports.login = async (req , res)=>{
    req.flash("success","Successfull Login... Welcome Back!");
    const redirectUrl = res.locals.redirectUrl || "/listing";
    res.redirect(redirectUrl);
}

module.exports.logout = (req , res , next)=>{
    req.logout((err)=>{
        if(err){
            return next(err);
        }
        req.flash("success" , "Logged Out Successfully");
        res.redirect("/listing");
    })
}
