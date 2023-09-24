const express = require("express");
const app = express();
const mongoose = require("mongoose");
const port = 8080;

async function main(){
    await mongoose.connect("mongodb://127.0.0.1:27017/wonderlust");
}

main().then(()=>{console.log("Connection to Database is Successfull")}).catch(()=>{console.log("Error in connecting Database")});


app.get("/" , (req , res)=>{
    res.send("Welcome to Wonderlust");
});

app.listen(port , ()=>{
    console.log(`App is listening at ${port}`);
});