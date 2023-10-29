const express = require("express");
const app = express();
const mongoose = require("mongoose");
const port = 8080;
const path = require("path");
const ejs = require("ejs");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");

const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");

app.set("view engine" , "ejs");
app.set("views" , path.join(__dirname , "views"));
app.use(express.static(path.join(__dirname , "/public")));
app.use(express.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.engine("ejs" , ejsMate);

const sessionOptions = {
    secret: "mysupersecretcode",
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7*24*60*60*1000,
        httpOnly: true
    }
}

app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

async function main(){
    await mongoose.connect("mongodb://127.0.0.1:27017/wonderlust");
}

main().then(()=>{console.log("Connection to Database is Successfull")}).catch(()=>{console.log("Error in connecting Database")});

app.get("/" , (req , res)=>{
    res.redirect("/listing");
});

app.use((req , res , next)=>{
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
});

app.get("/demouser" , async (req , res)=>{
    let fakeUser = new User({
        email: "fakeuser@gmail.com",
        username: "fakeUser"
    });

    let registeredUser = await User.register(fakeUser , "helloWorld");
    res.send(registeredUser);
});

app.use("/listing" , listingRouter);
app.use("/listing/:id/review" , reviewRouter);
app.use("/" , userRouter);

app.all("*" , (req , res , next)=>{
    next(new ExpressError(404 , "Page Not Found"));
});

app.use((err , req , res , next)=>{
    let {status = 500 , message = "Something went Wrong!"} = err;
    res.status(status).render("error.ejs" , {message});
});

app.listen(port , ()=>{
    console.log(`App is listening at ${port}`);
});