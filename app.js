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


// ___________________________________________________________________________________________________________________________


//mongoose/model Config
mongoose.connect("mongodb://localhost/automobili");

var blogSchema = new mongoose.Schema({
    title:String,
    image:String,
    body:String,
    created:{type:Date,default:Date.now}
});

var blog = mongoose.model("blog",blogSchema);

blog.create({
    title:"Lamborghini Urus",
    image:"https://www.autocar.co.uk/sites/autocar.co.uk/files/styles/gallery_slide/public/1-lamborghini-urus-review-hero-front.jpg?itok=4hqEvI9O",
    body:"A super sports car soul and the functionality typical for an SUV: this is Lamborghini Urus, the world’s first Super Sport Utility Vehicle. Identifiable as an authentic Lamborghini with its unmistakable DNA, Urus is at the same time a groundbreaking car: the extreme proportions, the pure Lamborghini design and the outstanding performance make it absolutely unique. Urus’ distinctive silhouette with a dynamic flying coupé line shows its super sports origins, while its outstanding proportions convey strength, solidity and safety. Urus’ success factors are definitely the design, the driving dynamics and the performance. All these features allowed Lamborghini to launch a Super Sport Utility Vehicle remaining loyal to its DNA."
});


//index Route
// app.get("/",function(req,res){
//     res.redirect("/blogs");
// });

app.get("/blogs",function(req,res){
    blog.find({},function(err,blogs){
        if(err)
        {
            console.log("ERROR");
        }
        else{
            res.render("index2.ejs",{blogs:blogs});
        }
      
    });
});

//new Route
app.get("/blogs/new",function(req,res){
    res.render("new2.ejs");

});

app.post("/blogs",function(req,res){
    blog.create(req.body.blog,function(err,newblog){
        if(err){
            res.render("new2.ejs");
        }
        else{
            res.redirect("/blogs");
        }

    });
});

//show route

app.get("/blogs/:id",function(req,res){
     blog.findById(req.params.id,function(err,foundblog){
         if(err){
               res.redirect("/blogs");
         }
         else{
         res.render("show2.ejs",{blog:foundblog});
         }     
    });
});

//edit route
app.get("/blogs/:id/edit",function(req,res){
    blog.findById(req.params.id,function(err,foundblog){
          if(err){
              res.redirect("/blogs");
          }
          else{
              res.render("edit2.ejs",{blog:foundblog});
          }
    });
});

//update route
 app.put("/blogs/:id",function(req,res){
     blog.findByIdAndUpdate(req.params.id,req.body.blog,function(err,updateblog){
         if(err){
             res.render("/blogs");
         }
         else{
             res.redirect("/blogs/"+req.params.id);
         }
     });
 });

//delete route
app.delete("/blogs/:id",function(req,res){
    blog.findByIdAndRemove(req.params.id,function(err){
    if(err){
        res.redirect("/blogs");
    }
    else{
        res.redirect("/blogs");
    }
});
});



// ___________________________________________________________________________________________________________________________




app.listen(5000,function(){
  console.log("server on 3000");
});
