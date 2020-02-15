//jshint esversion:6
//require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const session = require("express-session");
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");

const app = express();

app.use(express.static("public"));
app.set('view engine','ejs');
app.use(bodyParser.urlencoded({extended:true}));

app.use(session({
  secret: "Our little secret.",
  resave: false,
  saveUninitialized:false
}));

//initialize passport

app.use(passport.initialize());
app.use(passport.session());

mongoose.connect("mongodb://localhost:27017/userDB",{useNewUrlParser:true});
mongoose.set("useCreateIndex",true);

//creating schema
const userSchema = new mongoose.Schema({
  email : String,
  password : String
});

//to hash and salt
userSchema.plugin(passportLocalMongoose);

//creating object of userSchema
const User = new mongoose.model("User",userSchema);

passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.get("/",function(req,res){
  res.render("home");
});

app.get("/login",function(req,res){
  res.render("login");
});

//secrets route + checking if they are already authenticated
app.get("/secrets",function(req,res){
  if(req.isAuthenticated()){
    res.render("secrets");
  }else{
    res.redirect("/login");
  }
});

app.get("/register",function(req,res){
  res.render("register");
});

app.post("/register",function(req,res){
  //register() method from local mongoose it will interact with the database

  User.register({username: req.body.username}, req.body.password ,function(err,user){
    if(err){
      //phele register ka call back
      console.log(err);
      res.redirect("/register");
    }
    else{
      //uske baad authenticate ka call back
      passport.authenticate("local")(req,res, function(){
        res.redirect("/secrets");
      });
    }
  });
});

app.post("/login",function(req,res){

  const user = new User({
    username : req.body.username,
    password : req.body.password
  });

  //passport local login() method

  req.login(user, function(err){
    if(err){
      console.log(err);
    } else{
      passport.authenticate("local")(req,res, function(){
        res.redirect("/secrets");
      });
    }
  });

});

//de authenticated

app.get("/logout",function(req,res){
  req.logout();
  res.redirect("/");
});

app.listen(3000,function(){
  console.log("server on 3000");
});
