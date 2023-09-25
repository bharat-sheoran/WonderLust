const express = require("express");
const app = express();
const mongoose = require("mongoose");
const port = 8080;
const Listing = require("./models/listing.js");
const path = require("path");
const ejs = require("ejs");

app.set("view engine" , "ejs");
app.set("views" , path.join(__dirname , "views"));
app.use(express.static(path.join(__dirname , "/public")));
app.use(express.urlencoded({extended: true}));

async function main(){
    await mongoose.connect("mongodb://127.0.0.1:27017/wonderlust");
}

main().then(()=>{console.log("Connection to Database is Successfull")}).catch(()=>{console.log("Error in connecting Database")});

//Index Route
app.get("/listing" ,async (req , res)=>{
    const allListings = await Listing.find({});
    res.render("listings/index.ejs" , {allListings});
});


//Show Route
app.get("/listing/:id" , async (req , res)=>{
    const {id} = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/show.ejs" , {listing});
});

// app.get("/testListing" , async (req , res)=>{
//     let sampleListing = new Listing({
//         title: "My New Villa",
//         description: "By The Beach",
//         price: 10000,
//         location: "Calungute, Goa",
//         country: "India"
//     });

//     await sampleListing.save();
//     console.log("Sample was Saved Successfully");
//     res.send("Data Inserted Succsessfully");
// });

app.get("/" , (req , res)=>{
    res.send("Welcome to Wonderlust");
});

app.listen(port , ()=>{
    console.log(`App is listening at ${port}`);
});