var express = require('express');
var router = express.Router();
var Users=require("../models/Users")
var bcrypt = require('bcrypt')
var jwt =require('jsonwebtoken')
var {verifytokenAndAuthorization,verifytokenAndManager} =require('./verifytoken')


//register
router.post("/register",async (req,res)=>{
  var username = req.body.username;
  var password_input = req.body.password;

  //the rules of username and password
  if (!username && typeof username == "string") {
    res.json({ status: "error", error: "Invalid username or password" });
  }
  if (username.length < 6) {
    res.json({
      status: "error",
      error: "Invalid username , username should be more than 6 characters",
    });
  }
  if (!password_input || typeof password_input !== "string") {
    res.json({ status: "error", error: "Invalid username or password" });
  }
  if (password_input < 6) {
    res.json({
      status: "error",
      error: "Invalid password , password should be more than 6 characters",
    });
  }


  try {
  //crypt password
  var password = await bcrypt.hash(
    password_input,
    10
  );
  console.log(password);

    // save the user in the database
    await Users.create({ username, password });


    res.status(200).json("User Successfully Created ");
  } catch (err) {
    if (error.code === 11000) {
      //duplicate useraname
      return res.json({ status: "error", error: "Username already Taken" });
    }
    throw err;
    console.log(err);
  }
});

//login
router.post("/login", async (req,res)=>{
  var username = req.body.username;
  var password = req.body.password;

  try{
  var user= await Users.findOne({username}).lean(); //to make it string

  //the rules of username and password
  if (!username && typeof username == "string") {
    res.json({ status: "error", error: "Invalid username or password !" });
  }
  if (username.length < 6) {
    res.json({
      status: "error",
      error: "Invalid username , username should be more than 6 characters",
    });
  }
  if (!password || typeof password !== "string") {
    res.json({ status: "error", error: "Invalid username or password!!" });
  }
  if (password < 6) {
    res.json({
      status: "error",
      error: "Invalid password , password should be more than 6 characters",
    });
  }

  //check the username (if the username is exist)
  if(!user){
    res.json({ status: "error", error: "Invalid username or password!" });
  }
  if(bcrypt.compare(password,user.password)){
    // the password is right.
    const token=jwt.sign({
      id:user._id,
      username:user.username,
      isAdmin:user.isAdmin,
      job:user.job
    },process.env.secret_jwt_token)
    res.status(200).json({data:token})
  }
}catch(err){
    //if the password is wrong
    res.json({ status: "error", error: "Invalid username or password!!!" });
}
});

//get profile info (worker)
router.get('/profile/:id',verifytokenAndAuthorization ,async function(req, res, next) {

  try{
    console.log(req.user.id)
    var user=await Users.findById(req.user.id)
    var {password,status,...others}=user._doc

    if(status){res.status(200).json({others ,status: "He is active"})}
    else{res.status(200).json({others ,status: "He is inactive"})}  
  }catch(err){
    console.log(err)
  }
});


//get profile info (manager)
router.get('/profile/:id',verifytokenAndManager ,async function(req, res, next) {

  try{
    console.log(req.user.id)
    var user=await Users.findById(req.user.id)
    var {password,status,...others}=user._doc

    if(status){res.status(200).json({others ,status: "He is active"})}
    else{res.status(200).json({others ,status: "He is inactive"})}  
  }catch(err){
    console.log(err)
  }
});

//get profiles workers information
router.get('/profiles/:id',verifytokenAndManager ,async function(req, res, next) {

  try{
    
    var users=await Users.find()
    var arr=new Array()
    for( i=0 ; i<users.length ; i++){
      var {password ,_id,isAdmin,createdAt,updatedAt, __v ,...others} = users[i]._doc;
      arr.push(others)
    }
    res.status(200).json(arr)
  }catch(err){
    console.log(err)
  }
});


module.exports = router;
