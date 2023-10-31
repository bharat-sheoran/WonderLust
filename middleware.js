const Listing = require("./models/listing.js");
const Review = require("./models/review.js");

module.exports.isLoggedIn = (req , res , next)=>{
    if(!req.isAuthenticated()){
        req.session.redirectUrl = req.originalUrl;
        req.flash("error" , "Login to our Application");
        return res.redirect("/login");
    }
    next();
}

module.exports.saveRedirectUrl = (req , res , next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
}

module.exports.isOwner = async (req , res , next)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id);
    if(!listing.owner._id.equals(res.locals.currUser._id)){
        req.flash("error" , "Permission Denied");
        return res.redirect(`/listing/${id}`);
    }
    next();
}


module.exports.isReviewAuthor = async (req , res , next)=>{
    let {id , rid} = req.params;
    const review = await Review.findById(rid);
    if(!review.author.equals(res.locals.currUser._id)){
        req.flash("error" , "Permission Denied");
        return res.redirect(`/listing/${id}`);
    }
    next();
}
