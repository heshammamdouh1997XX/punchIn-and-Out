const jwt = require('jsonwebtoken')

//verifytoken for loggedIn users
const verifytoken = (req,res,next)=>{
    const authheader = req.headers.token
    const token=authheader.split(" ")[1]
    console.log(token)
    if(authheader){
        jwt.verify(token,process.env.secret_jwt_token,(err,user)=>{
            if(err){res.status(401).json("Token not valid !!");}
            console.log(user)   // id + isAdmin  (decoded)
            req.user=user      //session
            next();
        });
    }else{
        res.status(401).json("You are not a User !!")
    }
}
//To prevent IDOR vuln. (you need to put the id in url) 
const verifytokenAndAuthorization=(req,res,next)=>{
    verifytoken(req,res,()=>{
        if(req.user.id === req.params.id || req.user.isAdmin){
            next();
        }else{
            res.status(403).json("You are not that user !!")
        }
    })
}

const verifytokenAndAdmin=(req,res,next)=>{
    verifytoken(req,res,()=>{
        if( req.user.isAdmin){
            next();
        }else{
            res.status(403).json("You are not the admin")
        }
    })
}

const verifytokenAndManager=(req,res,next)=>{
    verifytoken(req,res,()=>{
        if(req.user.job =="Manager" && req.user.id === req.params.id || req.user.isAdmin ){
            next()
        }else{
            res.status(403).json("You are not the manager")
        }
    })
}

module.exports={verifytokenAndAuthorization,verifytokenAndAdmin,verifytoken,verifytokenAndManager}