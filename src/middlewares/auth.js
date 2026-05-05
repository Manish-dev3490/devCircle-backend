const jwt=require('jsonwebtoken');
const User = require('../models/user');
 async function authValidation(req,res,next){

    try{
        const {token}=req.cookies;
        if(!token)throw new Error("token is not present");
        const isAllowed=jwt.verify(token,"$foobar$");
        const user=await User.findById(isAllowed._id);
        if(!user)throw new Error("user is not present in db");
        req.user=user;
        next();

    }

    catch(error){
        res.status(401).send("something went wrong"+error);
    }
 }


 module.exports=authValidation