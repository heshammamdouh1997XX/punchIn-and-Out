var express = require('express');
var router = express.Router();
var {verifytokenAndAuthorization,verifytoken} =require('./verifytoken')
var User=require('../models/Users')
var punchtime=require('../models/punchTime')
var mongoose=require('mongoose')
var moment=require("moment")

//punch in or out
router.post('/',verifytoken, async (req,res)=>{
  var user=req.user
  try{
    var theUser=await User.findOne({username:user.username}) //get the info of the user

    const date1 = new Date();
    const R_date={
      month:date1.getMonth(),
      date:date1.getDate(),
      hour:date1.getHours(),
      minute:date1.getMinutes()
    }

    //see if he is acitve or not 
    if(theUser.status){
      //he is active so we will make him inactive         // punchout time
      await User.updateOne(
        { username: user.username },
        { $set: { status: false } }
      );
      
      //Object id of the username
      const userinfo = await User.findOne({ username: user.username })

      var user_id = userinfo._id;
      var punchtime_id = userinfo.punchtime._id.toString();

      // findbyid and update to put (timeout)
      await punchtime.findByIdAndUpdate(punchtime_id,{$set:{timeOut:R_date}})
      
      //put how many hours worked by substract timein and timeout
      const punchtime2 = await punchtime.findById(punchtime_id)
      const punchin = punchtime2.timeIn
      const punchout = punchtime2.timeOut
      //substraction 
      console.log((punchin))
      //in this part i dont know how to do it.

      
        //if it's the same day
        let valuestart=moment.duration(punchIn.hour + ":" + punchIn.minute,"HH:mm")
        let valuestop =moment.duration(punchout.hour + ":" + punchout.minute,"HH:mm")
        let differene =valuestop.sustract(valuestart)
        console.log(difference.hours() + ":" + difference.minutes())


      const lastuser = await User.findById(user_id)
      .populate("punchtime")

      res.status(200).json({ data1:lastuser });


    }else{
      //he is inactive so we will make him active
      await User
      .updateOne({username:user.username},
        {$set:{status:true}})

      // punchin time
      const punchIn =await punchtime.create({timeIn:R_date})

      //Object id of the username
      const userinfo = await User.findOne({username:user.username})
      var user_id = userinfo._id

      //connect username to punchtime
      await User.findByIdAndUpdate(user_id,
        {$set:{punchtime:punchIn._id}})

      const lastuser=await User.findById(user_id)
      .populate('punchtime')

        res.status(200).json({data2:lastuser})
    }
    // res.status(200).json(theUser.status)
  }catch(err){
    console.log(err)
  }
})
module.exports = router;
